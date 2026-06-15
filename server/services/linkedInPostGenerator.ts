/**
 * LinkedIn Post Generator
 *
 * Takes a trigger detection and returns a ready-to-copy LinkedIn post.
 * Uses the same domain narrative logic as the Prospect Signal Brief email
 * but formatted as plain text for LinkedIn.
 */

export interface PostableDetection {
  id: number;
  triggerName: string;
  triggerDomain: string;
  signalDescription: string;
  confidenceScore: number;
  recommendedPlaybook: string | null;
  detectedAt: Date | string;
}

function getDomainNarrative(domain: string): {
  prepared: Array<{ min: string; action: string }>;
  traditional: Array<{ delay: string; action: string }>;
  brutalLine: string;
  hashtags: string[];
} {
  const d = (domain || '').toLowerCase();

  if (d.includes('cyber') || d.includes('ransom') || d.includes('breach') || d.includes('security')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Threat pattern confirmed across 248 sources' },
        { min: 'Min 2', action: 'Containment protocol staged — zero setup required' },
        { min: 'Min 5', action: 'IT, security, legal, and comms briefed simultaneously' },
        { min: 'Min 9', action: 'Containment decision in executive inbox' },
        { min: 'Min 12', action: 'Executing — scope contained, narrative controlled' },
      ],
      traditional: [
        { delay: 'Hour 1', action: 'IT notices anomaly. Alert goes up the chain.' },
        { delay: 'Hour 4', action: '"Let\'s get the incident response team on a call."' },
        { delay: 'Day 1', action: 'Scope still unknown. Consultants engaged.' },
        { delay: 'Day 3', action: 'Executive still waiting on full assessment.' },
        { delay: 'Week 1', action: 'Containment begins. Damage is done.' },
      ],
      brutalLine: 'In a ransomware event, the first 12 minutes determine whether you contain it or spend six months recovering from it.',
      hashtags: ['#CyberResilience', '#IncidentResponse', '#ReadinessOS', '#EnterpriseExecution', '#StrategicReadiness'],
    };
  }

  if (d.includes('regulat') || d.includes('compliance') || d.includes('fda') || d.includes('sec') || d.includes('doj')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Regulatory signal confirmed — exposure pre-mapped' },
        { min: 'Min 2', action: 'Compliance response protocol staged automatically' },
        { min: 'Min 5', action: 'Legal, compliance, ops, and board liaison briefed' },
        { min: 'Min 9', action: 'Response strategy authorized by executive' },
        { min: 'Min 12', action: 'Filing in progress — narrative ahead of the cycle' },
      ],
      traditional: [
        { delay: 'Hour 2', action: 'Alert surfaces in someone\'s inbox.' },
        { delay: 'Hour 6', action: 'Legal team cc\'d on an email chain.' },
        { delay: 'Day 3', action: 'External counsel engaged. "What\'s our exposure?"' },
        { delay: 'Week 2', action: 'Response strategy still being drafted.' },
        { delay: 'Week 4', action: 'Filing submitted — regulators already set the narrative.' },
      ],
      brutalLine: 'Regulators move fast. Organizations that respond in hours are the ones who had the response staged before the signal fired.',
      hashtags: ['#RegulatoryCompliance', '#RiskManagement', '#ReadinessOS', '#EnterpriseExecution', '#StrategicReadiness'],
    };
  }

  if (d.includes('supply') || d.includes('geopol') || d.includes('logist') || d.includes('manufactur')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Disruption signal confirmed — impact pre-modeled' },
        { min: 'Min 2', action: 'Supply continuity protocol staged — alternates mapped' },
        { min: 'Min 5', action: 'Ops, procurement, finance, and sales briefed' },
        { min: 'Min 9', action: 'Continuity plan authorized — production protected' },
        { min: 'Min 12', action: 'Alternate sourcing executing — zero production loss' },
      ],
      traditional: [
        { delay: 'Day 1', action: 'Supplier sends disruption notification.' },
        { delay: 'Day 2', action: '"Do we have backup suppliers?" Nobody knows.' },
        { delay: 'Day 4', action: 'Procurement meeting called. Options being explored.' },
        { delay: 'Week 2', action: 'Alternate supplier identified. Negotiations begin.' },
        { delay: 'Week 4', action: 'Production already impacted. Customers notified.' },
      ],
      brutalLine: 'Supply chain disruptions don\'t wait for your procurement meeting. Prepared organizations never stop moving because the response was staged before the disruption arrived.',
      hashtags: ['#SupplyChain', '#OperationalResilience', '#ReadinessOS', '#EnterpriseExecution', '#StrategicReadiness'],
    };
  }

  if (d.includes('financial') || d.includes('activist') || d.includes('investor') || d.includes('m&a') || d.includes('acqui')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Activist signal confirmed — stake and history analyzed' },
        { min: 'Min 2', action: 'Investor response protocol staged — precedents loaded' },
        { min: 'Min 5', action: 'Board, legal, IR, and banking relationships briefed' },
        { min: 'Min 9', action: 'Response strategy authorized by executive' },
        { min: 'Min 12', action: 'Board-ready brief delivered — narrative controlled' },
      ],
      traditional: [
        { delay: 'Hour 4', action: 'SEC filing surfaces. "Get the board on a call."' },
        { delay: 'Day 2', action: 'Banker engaged. Defensive strategy "in development."' },
        { delay: 'Week 1', action: 'Board meeting scheduled. Deck being prepared.' },
        { delay: 'Week 3', action: 'Response strategy finalized.' },
        { delay: 'Week 4', action: 'Activist already set the narrative. Defense is reactive.' },
      ],
      brutalLine: 'Activist investors select organizations that are unprepared. A pre-staged response changes the power dynamic before the first call.',
      hashtags: ['#InvestorRelations', '#ActivistInvestor', '#ReadinessOS', '#EnterpriseExecution', '#StrategicReadiness'],
    };
  }

  if (d.includes('market') || d.includes('competit') || d.includes('growth') || d.includes('position')) {
    return {
      prepared: [
        { min: 'Min 0', action: 'Competitive signal confirmed across market intelligence' },
        { min: 'Min 2', action: 'Market response protocol staged automatically' },
        { min: 'Min 5', action: 'Sales, marketing, product, and strategy briefed' },
        { min: 'Min 9', action: 'Counter-move authorized by executive' },
        { min: 'Min 12', action: 'Executing — repositioning ahead of market cycle' },
      ],
      traditional: [
        { delay: 'Hour 4', action: 'Someone spots the news on LinkedIn.' },
        { delay: 'Day 1', action: '"Let\'s schedule a strategy session on this."' },
        { delay: 'Week 1', action: 'Competitive analysis being commissioned.' },
        { delay: 'Week 2', action: 'Response strategy still in review.' },
        { delay: 'Week 4', action: 'Competitors have already repositioned. You\'re reacting.' },
      ],
      brutalLine: 'Every enterprise has the same market intelligence tools. The difference is who had the response to this signal staged before it fired.',
      hashtags: ['#CompetitiveStrategy', '#MarketIntelligence', '#ReadinessOS', '#EnterpriseExecution', '#StrategicReadiness'],
    };
  }

  return {
    prepared: [
      { min: 'Min 0', action: 'Signal confirmed across 248 continuous monitoring sources' },
      { min: 'Min 2', action: 'Readiness Protocol staged — zero setup, zero coordination' },
      { min: 'Min 5', action: 'All relevant stakeholders briefed with role-specific context' },
      { min: 'Min 9', action: 'Decision package delivered to the authorizing executive' },
      { min: 'Min 12', action: 'Executing — response ahead of the market' },
    ],
    traditional: [
      { delay: 'Hour 2', action: 'Someone notices the signal. Mentions it in a meeting.' },
      { delay: 'Day 1', action: '"We should get a call together on this."' },
      { delay: 'Week 1', action: 'First strategy session held. Deck assigned.' },
      { delay: 'Week 2', action: 'Stakeholder alignment still in progress.' },
      { delay: 'Week 4', action: 'Response begins. Competitors are weeks ahead.' },
    ],
    brutalLine: 'The 30-day mobilization cycle isn\'t a speed problem. It\'s a preparation problem. The response was ready before the trigger fired.',
    hashtags: ['#StrategicReadiness', '#ReadinessOS', '#EnterpriseExecution', '#OperatingModel', '#FutureOfWork'],
  };
}

export function generateLinkedInPost(detection: PostableDetection): string {
  const narrative = getDomainNarrative(detection.triggerDomain);
  const signal = detection.signalDescription || detection.triggerName;
  const protocol = detection.recommendedPlaybook || 'Readiness Protocol';

  const preparedLines = narrative.prepared
    .map((r, i) => `${i < 4 ? '✓' : '→'} ${r.min} — ${r.action}`)
    .join('\n');

  const traditionalLines = narrative.traditional
    .map(r => `○ ${r.delay} — ${r.action}`)
    .join('\n');

  const tags = narrative.hashtags.join(' ');

  return `${signal}

Most organizations just found out.

A prepared organization had the response staged before this signal fired. No meeting was called. No committee convened. The clock started automatically.

Here's what happened in the first 12 minutes — prepared vs. traditional:

━━━ PREPARED ORGANIZATION ━━━━━━━━━━━━
${preparedLines}
→ Min 12 — Executing

━━━ TRADITIONAL RESPONSE ━━━━━━━━━━━━
${traditionalLines}
○ Still mobilizing.

${narrative.brutalLine}

The difference isn't who has better people. It's who had the response staged before the trigger fired.

That's a 3,600× execution head start — 30 days of mobilization compressed to 12 minutes.

——

${protocol} · Pre-staged across 180 Readiness Protocols
The response is ready before the trigger fires.

${tags}`;
}
