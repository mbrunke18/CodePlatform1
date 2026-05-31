import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Link2, Shield, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CustomProtocol } from '@shared/schema';

const NAVY  = '#0A0F2E';
const GOLD  = '#C9A84C';
const TEAL  = '#2B8A6E';
const MUTED = '#6B7280';
const BORDER = '#E5E2D9';

const DOMAIN_LABELS: Record<string, string> = {
  growth:         'GROWTH & POSITIONING',
  offense:        'GROWTH & POSITIONING',
  risk:           'RISK & RESILIENCE',
  defense:        'RISK & RESILIENCE',
  transformation: 'TRANSFORMATION',
  special_teams:  'TRANSFORMATION',
};

function domainLabel(d: string) {
  return DOMAIN_LABELS[d?.toLowerCase()] ?? d?.toUpperCase() ?? '—';
}

function domainColor(d: string) {
  const k = d?.toLowerCase() ?? '';
  if (k === 'growth' || k === 'offense') return '#2B8A6E';
  if (k === 'risk' || k === 'defense') return '#DC2626';
  return '#7C3AED';
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
      {[1, 2, 3].map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: step >= s ? NAVY : '#F0EDE4',
            border: `2px solid ${step >= s ? NAVY : BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: step >= s ? GOLD : MUTED,
          }}>{s}</div>
          {i < 2 && (
            <div style={{ width: 60, height: 2, background: step > s ? NAVY : BORDER }} />
          )}
        </div>
      ))}
      <div style={{ marginLeft: 16, fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {step === 1 ? 'Select Protocol A' : step === 2 ? 'Select Protocol B' : 'Name & Confirm'}
      </div>
    </div>
  );
}

function ProtocolSelectCard({
  protocol,
  selected,
  disabled,
  onSelect,
}: {
  protocol: CustomProtocol;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      style={{
        width: '100%', textAlign: 'left', padding: '16px 20px',
        border: `2px solid ${selected ? NAVY : disabled ? '#F0EDE4' : BORDER}`,
        borderRadius: '0.15rem',
        background: selected ? `${NAVY}08` : disabled ? '#FAFAFA' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'border-color 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: domainColor(protocol.triggerDomain), textTransform: 'uppercase' }}>
            {domainLabel(protocol.triggerDomain)}
          </span>
          <span style={{ fontSize: 10, color: MUTED, fontWeight: 600, background: '#F0EDE4', padding: '2px 6px', borderRadius: '0.1rem' }}>
            {protocol.status?.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{protocol.name}</div>
        {protocol.triggerCondition && (
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
            {protocol.triggerCondition.length > 90 ? protocol.triggerCondition.slice(0, 90) + '…' : protocol.triggerCondition}
          </div>
        )}
      </div>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        border: `2px solid ${selected ? NAVY : BORDER}`,
        background: selected ? NAVY : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {selected && <CheckCircle size={14} color={GOLD} />}
      </div>
    </button>
  );
}

export default function CompoundProtocolBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [protocolA, setProtocolA] = useState<CustomProtocol | null>(null);
  const [protocolB, setProtocolB] = useState<CustomProtocol | null>(null);
  const [compoundName, setCompoundName] = useState('');
  const [triggerLogic, setTriggerLogic] = useState<'AND' | 'OR'>('AND');
  const [description, setDescription] = useState('');

  const { data: protocolsRaw, isLoading } = useQuery<CustomProtocol[]>({
    queryKey: ['/api/custom-protocols'],
  });

  const protocols: CustomProtocol[] = (Array.isArray(protocolsRaw) ? protocolsRaw : []).filter(
    p => !p.isCompound && p.status !== 'draft'
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!protocolA || !protocolB) throw new Error('Select both protocols');
      const payload = {
        name: compoundName || `${protocolA.name} + ${protocolB.name}`,
        triggerDomain: protocolA.triggerDomain,
        triggerCondition: description || `Compound activation: ${protocolA.triggerCondition} simultaneously with ${protocolB.triggerCondition}`,
        industry: protocolA.industry ?? '',
        riskThreshold: 'CRITICAL',
        executiveOwners: protocolA.executiveOwners ?? {},
        immediateTasks: [
          ...((protocolA.immediateTasks as any[]) ?? []),
          ...((protocolB.immediateTasks as any[]) ?? []),
        ],
        secondaryTasks: [
          ...((protocolA.secondaryTasks as any[]) ?? []),
          ...((protocolB.secondaryTasks as any[]) ?? []),
        ],
        followUpTasks: [
          ...((protocolA.followUpTasks as any[]) ?? []),
          ...((protocolB.followUpTasks as any[]) ?? []),
        ],
        communicationChain: protocolA.communicationChain ?? {},
        budgetEnvelope: protocolA.budgetEnvelope ?? {},
        linkedSignalIds: [
          ...((protocolA.linkedSignalIds as string[]) ?? []),
          ...((protocolB.linkedSignalIds as string[]) ?? []),
        ],
        mandatorySignalIds: [
          ...((protocolA.mandatorySignalIds as string[]) ?? []),
          ...((protocolB.mandatorySignalIds as string[]) ?? []),
        ],
        readinessMode: 'both' as const,
        readinessPct: 80,
        status: 'active',
        completedSteps: 7,
        isCompound: true,
        linkedProtocolIds: [protocolA.id, protocolB.id],
        compoundTriggerLogic: triggerLogic,
      };

      const res = await apiRequest('POST', '/api/custom-protocols', payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-protocols'] });
      toast({ title: 'Compound Protocol Created', description: 'Dual-track activation protocol is ready.' });
      setLocation('/my-protocols');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create compound protocol.', variant: 'destructive' });
    },
  });

  const elegibleForB = protocols.filter(p => p.id !== protocolA?.id);

  return (
    <PageLayout>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
            COMPOUND PROTOCOL BUILDER
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: NAVY, margin: 0, lineHeight: 1.15 }}>
            Dual-Track Activation
          </h1>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 10, maxWidth: 520, lineHeight: 1.6 }}>
            Link two Readiness Protocols into a single compound activation. When both triggers fire simultaneously, a unified 12-minute execution begins across both response tracks.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* Step 1 — Select Protocol A */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
              Select the first protocol — <span style={{ color: MUTED, fontWeight: 500 }}>this becomes Track A of the dual activation</span>
            </div>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => <div key={i} style={{ height: 80, background: '#F8F7F4', borderRadius: '0.15rem' }} />)}
              </div>
            ) : protocols.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', border: `1px dashed ${BORDER}`, borderRadius: '0.15rem' }}>
                <AlertTriangle size={28} color={GOLD} style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 8 }}>No active protocols yet</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>You need at least two completed protocols to build a compound.</div>
                <Link href="/protocol-builder">
                  <button style={{ padding: '10px 20px', background: NAVY, color: GOLD, border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Build a Protocol First
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {protocols.map(p => (
                  <ProtocolSelectCard
                    key={p.id}
                    protocol={p}
                    selected={protocolA?.id === p.id}
                    disabled={false}
                    onSelect={() => setProtocolA(protocolA?.id === p.id ? null : p)}
                  />
                ))}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
              <button
                onClick={() => setStep(2)}
                disabled={!protocolA}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: protocolA ? NAVY : '#E5E2D9', color: protocolA ? GOLD : MUTED, border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 13, cursor: protocolA ? 'pointer' : 'not-allowed' }}
              >
                Next: Select Protocol B <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Select Protocol B */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px 16px', background: `${TEAL}0A`, border: `1px solid ${TEAL}40`, borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={14} color={TEAL} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Track A: {protocolA?.name}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
              Select the second protocol — <span style={{ color: MUTED, fontWeight: 500 }}>Track B of the dual activation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {elegibleForB.map(p => (
                <ProtocolSelectCard
                  key={p.id}
                  protocol={p}
                  selected={protocolB?.id === p.id}
                  disabled={false}
                  onSelect={() => setProtocolB(protocolB?.id === p.id ? null : p)}
                />
              ))}
              {elegibleForB.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: MUTED, fontSize: 14 }}>
                  No other protocols available. Build another protocol to continue.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 20px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', fontWeight: 600, fontSize: 13, color: NAVY, cursor: 'pointer' }}>
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!protocolB}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: protocolB ? NAVY : '#E5E2D9', color: protocolB ? GOLD : MUTED, border: 'none', borderRadius: '0.15rem', fontWeight: 700, fontSize: 13, cursor: protocolB ? 'pointer' : 'not-allowed' }}
              >
                Next: Name & Confirm <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Name & Confirm */}
        {step === 3 && (
          <div>
            {/* Selected protocols summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 28 }}>
              <div style={{ padding: '14px 16px', border: `1px solid ${TEAL}50`, borderRadius: '0.15rem', background: `${TEAL}08` }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: TEAL, textTransform: 'uppercase', marginBottom: 4 }}>TRACK A</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{protocolA?.name}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{domainLabel(protocolA?.triggerDomain ?? '')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Link2 size={20} color={GOLD} />
                <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: '0.08em' }}>COMPOUND</span>
              </div>
              <div style={{ padding: '14px 16px', border: `1px solid #7C3AED30`, borderRadius: '0.15rem', background: `#7C3AED08` }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: '#7C3AED', textTransform: 'uppercase', marginBottom: 4 }}>TRACK B</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{protocolB?.name}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{domainLabel(protocolB?.triggerDomain ?? '')}</div>
              </div>
            </div>

            {/* Trigger logic */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Activation Logic
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {([
                  { value: 'AND', label: 'Both Must Fire', desc: 'Activates only when signals from Track A AND Track B both cross threshold simultaneously.' },
                  { value: 'OR',  label: 'Either Fires',  desc: 'Activates when signals from Track A OR Track B cross threshold — both response tracks launch.' },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTriggerLogic(opt.value)}
                    style={{
                      textAlign: 'left', padding: '14px 16px',
                      border: `2px solid ${triggerLogic === opt.value ? NAVY : BORDER}`,
                      borderRadius: '0.15rem',
                      background: triggerLogic === opt.value ? `${NAVY}08` : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Zap size={13} color={triggerLogic === opt.value ? GOLD : MUTED} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: triggerLogic === opt.value ? NAVY : MUTED }}>
                        {opt.value}: {opt.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compound protocol name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Compound Protocol Name
              </label>
              <input
                type="text"
                value={compoundName}
                onChange={e => setCompoundName(e.target.value)}
                placeholder={`${protocolA?.name} + ${protocolB?.name}`}
                style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', fontSize: 14, color: NAVY, fontWeight: 500, boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Activation Context <span style={{ color: MUTED, fontSize: 11, fontWeight: 500, textTransform: 'none' }}>(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the scenario where both protocols would need to activate simultaneously..."
                rows={3}
                style={{ width: '100%', padding: '11px 14px', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', fontSize: 13, color: NAVY, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            {/* Summary box */}
            <div style={{ padding: '16px 20px', border: `1px solid ${GOLD}40`, background: `${GOLD}08`, borderRadius: '0.15rem', marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: GOLD, textTransform: 'uppercase', marginBottom: 10 }}>What gets created</div>
              {[
                `Compound protocol linking Track A (${protocolA?.name}) + Track B (${protocolB?.name})`,
                `Trigger logic: ${triggerLogic === 'AND' ? 'Both tracks must signal before activation' : 'Either track signal triggers the full dual activation'}`,
                `Tasks merged from both protocols into a unified 12-minute execution`,
                `Signal coverage inherited from both source protocols`,
                'Appears in My Protocols hub with COMPOUND badge',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, fontSize: 13, color: NAVY }}>
                  <CheckCircle size={13} color={TEAL} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 20px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '0.15rem', fontWeight: 600, fontSize: 13, color: NAVY, cursor: 'pointer' }}>
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: NAVY, color: GOLD, border: 'none', borderRadius: '0.15rem', fontWeight: 800, fontSize: 13, cursor: saveMutation.isPending ? 'wait' : 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                <Link2 size={15} />
                {saveMutation.isPending ? 'Creating…' : 'Create Compound Protocol'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
