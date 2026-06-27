import { db } from '../db';
import { playbookLibrary, playbookDomains, playbookCategories } from '@shared/schema';
import { inArray } from 'drizzle-orm';

const DOMAIN_NAMES: Record<number, string> = {
  1: 'Market Dynamics',
  2: 'Operational Excellence',
  3: 'Financial Strategy',
  4: 'Regulatory & Compliance',
  5: 'Technology & Innovation',
  6: 'Talent & Leadership',
  7: 'Brand & Reputation',
  8: 'Market Opportunities',
  9: 'AI Governance',
};

const MASTER_PHASES = [
  {
    id: 'phase-1',
    name: 'IDENTIFY: Unknown Trigger Recognition',
    timeWindow: 'T+0:00 to T+0:12',
    objective: 'Confirm no existing Readiness Protocol matches the detected trigger. Characterize the event type, scope, and domain proximity. Activate Protocol #0 routing.',
    tasks: [
      {
        role: 'CEO',
        priority: 'lead',
        deadline: 'within 5 minutes',
        items: [
          'Receive Protocol #0 activation brief from Chief of Staff',
          'Confirm trigger source and preliminary characterization',
          'Authorize Protocol #0 routing — universal response infrastructure activates',
          'Convene C-suite situation room'
        ]
      },
      {
        role: 'Chief of Staff',
        priority: 'lead',
        deadline: 'within 3 minutes',
        items: [
          'Confirm system scan of all 180 Readiness Protocols — NO MATCH confirmed',
          'Characterize trigger: source, estimated scope, initial domain proximity',
          'Activate authority chain — all Tier 1 stakeholders notified simultaneously',
          'Open situation log — every decision and action timestamped from T+0'
        ]
      },
      {
        role: 'General Counsel',
        priority: 'required',
        deadline: 'within 8 minutes',
        items: [
          'Initial legal exposure assessment — regulatory, contractual, and liability dimensions',
          'Confirm privilege protection for all situation room communications',
          'Identify external counsel to activate if legal complexity confirmed'
        ]
      }
    ],
    restrictions: [
      'No external communications of any kind',
      'No resource commitments or spending authorizations',
      'No field execution until DETECT phase complete',
      'All situation room communications under privilege'
    ],
    decisionGate: {
      title: 'IDENTIFY → DETECT Gate',
      criteria: [
        'No protocol match confirmed — all 180 Readiness Protocols scanned',
        'Trigger source identified and characterized',
        'Protocol #0 routing authorized by CEO',
        'All Tier 1 stakeholders confirmed in situation room'
      ],
      escalation: 'If CEO is unavailable, COO has full Protocol #0 authority. Document the authorization chain in the situation log.'
    }
  },
  {
    id: 'phase-2',
    name: 'DETECT: Situation Assessment Framework',
    timeWindow: 'T+0:12 to T+1:00',
    objective: 'Deploy all 6 Protocol #0 components. Map the unknown trigger across all known risk dimensions. Surface the critical unknowns before full execution.',
    tasks: [
      {
        role: 'CEO + C-suite',
        priority: 'lead',
        deadline: 'within 15 minutes',
        items: [
          'Structured situation assessment: What do we know? What don\'t we know? What could make this worse?',
          'Map the trigger to the closest known risk dimensions across all 9 domains',
          'Assign domain owners for each risk dimension identified',
          'Set the 12-minute execution standard and first 24-hour objectives'
        ]
      },
      {
        role: 'CFO',
        priority: 'lead',
        deadline: 'within 20 minutes',
        items: [
          'Unlock emergency budget envelope — pre-approved Protocol #0 authorization',
          'Establish spend authorization hierarchy for the situation',
          'Model financial exposure range: floor / base case / ceiling',
          'Identify board notification triggers (dollar threshold, regulatory exposure)'
        ]
      },
      {
        role: 'General Counsel',
        priority: 'lead',
        deadline: 'within 20 minutes',
        items: [
          'Activate external counsel retainer — pre-negotiated Protocol #0 engagement',
          'Assess regulatory notification obligations and timeline',
          'Establish communication protocol: what can be said, to whom, when',
          'Prepare board/audit committee notification if regulatory exposure confirmed'
        ]
      },
      {
        role: 'PMO Director',
        priority: 'required',
        deadline: 'within 30 minutes',
        items: [
          'Initiate Rapid Protocol Build — structured framework for capturing the new protocol',
          'Begin encoding all decisions, stakeholders, and workstreams in real time',
          'Identify the closest existing protocol as structural template for the new permanent protocol',
          'Set debrief and close-out timeline'
        ]
      }
    ],
    restrictions: [
      'No public statements or media engagement',
      'All spend requires CFO co-authorization',
      'No field execution until situation assessment is complete',
      'External counsel communications under privilege'
    ],
    decisionGate: {
      title: 'DETECT → EXECUTE Gate',
      criteria: [
        'All 6 Protocol #0 components active and staffed',
        'Situation assessment complete — known, unknown, and escalation dimensions mapped',
        'Emergency budget envelope unlocked and spend authorization hierarchy confirmed',
        'Rapid Protocol Build initiated — PMO Director encoding the new protocol',
        'Board/Audit Committee notified if regulatory threshold confirmed'
      ],
      escalation: 'If situation assessment reveals cross-domain exposure (3+ domains affected), escalate to full board notification and engage Protocol #0 external advisory roster.'
    }
  },
  {
    id: 'phase-3',
    name: 'EXECUTE: Pre-Staged Universal Response',
    timeWindow: 'T+1:00 to T+12:00',
    objective: 'Execute a coordinated first response using Protocol #0 infrastructure. Every decision, workstream, and outcome is encoded as raw material for the new permanent protocol.',
    tasks: [
      {
        role: 'CEO',
        priority: 'lead',
        deadline: 'ongoing — 30-minute check-ins',
        items: [
          'Authorize each workstream as confirmed by domain owners',
          'Hold the 12-minute execution standard — no coordination delays',
          'Maintain decision authority: no workstream executes without explicit authorization',
          'Drive toward the first publicly communicable position within 4 hours'
        ]
      },
      {
        role: 'COO',
        priority: 'lead',
        deadline: 'within 2 hours of EXECUTE activation',
        items: [
          'Coordinate all operational workstreams across functional teams',
          'Ensure no workstream is waiting on another without explicit sequencing',
          'Manage the situation room cadence — status every 30 minutes',
          'Escalate resource conflicts to CEO immediately'
        ]
      },
      {
        role: 'Domain Owners (assigned in DETECT)',
        priority: 'required',
        deadline: 'per workstream authorization',
        items: [
          'Execute assigned workstream with pre-approved budget envelope',
          'Report status every 30 minutes to COO',
          'Escalate any decision requiring authority beyond their level immediately',
          'Capture every decision and action in the situation log — this becomes the new protocol'
        ]
      },
      {
        role: 'PMO Director',
        priority: 'required',
        deadline: 'continuous throughout EXECUTE',
        items: [
          'Encode every decision, action, stakeholder, and outcome in real time',
          'Draft new protocol structure as execution unfolds — this is the live build',
          'Identify the trigger criteria, authority chain, and decision gates for the new protocol',
          'Prepare close-out package for ADVANCE phase'
        ]
      }
    ],
    restrictions: [
      'All workstreams require explicit CEO/COO authorization before launch',
      'Every decision must be logged — no verbal-only decisions',
      'All external communications require General Counsel sign-off',
      'No off-protocol spending — all spend through approved CFO envelope'
    ],
    decisionGate: {
      title: 'EXECUTE → ADVANCE Gate',
      criteria: [
        'First response fully coordinated and executing across all active workstreams',
        'Board/Audit Committee briefed with situation summary and response posture',
        'External communications posture confirmed by CEO and General Counsel',
        'New protocol draft structure complete — trigger, stakeholders, phases captured',
        'Situation stable enough for structured close-out planning to begin'
      ],
      escalation: 'If situation is not stabilizing by T+8 hours, escalate to board emergency session and engage full external advisory roster.'
    }
  },
  {
    id: 'phase-4',
    name: 'ADVANCE: New Protocol Build & Library Update',
    timeWindow: 'T+12:00 onward',
    objective: 'Close out the activation. Formalize the new protocol with full IDEA Framework structure. Feed all learnings back into the library so the organization is permanently stronger after every unknown.',
    tasks: [
      {
        role: 'PMO Director',
        priority: 'lead',
        deadline: 'within 5 business days of close-out',
        items: [
          'Finalize the new protocol with complete IDEA Framework phases, stakeholders, decision gates, and budget envelope',
          'Document the trigger criteria and signal patterns that would have detected this event earlier',
          'Identify cross-domain dependencies and update affected existing protocols',
          'Submit for CEO and General Counsel review'
        ]
      },
      {
        role: 'CEO',
        priority: 'lead',
        deadline: 'within 10 business days of close-out',
        items: [
          'Review and authorize the new protocol for permanent library inclusion',
          'Conduct post-activation debrief with full C-suite',
          'Identify what preparation would have accelerated the response',
          'Direct PMO to update existing protocols with new cross-domain signals'
        ]
      },
      {
        role: 'ADVANCE Loop',
        priority: 'required',
        deadline: 'automated on close-out completion',
        items: [
          'Distribute activation learnings across all 180 existing protocols — update signal patterns',
          'Register new detection threshold in the detection library',
          'Update authority chain precedent records for future executive reference',
          'Generate causal hypothesis: what preparation changes would have compressed response by how many minutes'
        ]
      },
      {
        role: 'Board / Governance',
        priority: 'required',
        deadline: 'next board meeting',
        items: [
          'Present new protocol to board for awareness',
          'Update organizational risk registry with new detection threshold category',
          'Confirm readiness investment if recurrence is likely',
          'Annual review: Protocol #0 activation history — is the library keeping pace with emerging threats?'
        ]
      }
    ],
    restrictions: [
      'New protocol cannot be added to library without CEO authorization',
      'All close-out materials under legal hold until General Counsel releases'
    ],
    decisionGate: {
      title: 'ADVANCE Close-Out Gate',
      criteria: [
        'New protocol fully documented with complete IDEA Framework structure',
        'CEO has authorized new protocol for permanent library inclusion',
        'ADVANCE loop has distributed learnings across affected existing protocols',
        'New detection threshold registered in detection library',
        'Board notified and organizational risk registry updated'
      ],
      escalation: 'If new protocol documentation reveals systemic gaps in the existing library (5+ protocols affected), initiate a full library review before close-out.'
    }
  }
];

function buildDomainPhases(domainName: string, lead: string, stakeholders: string[]): object[] {
  return [
    {
      id: 'phase-1',
      name: 'IDENTIFY: Unknown Trigger Recognition',
      timeWindow: 'T+0:00 to T+0:12',
      objective: `Confirm no existing ${domainName} Readiness Protocol matches the detected trigger. Characterize the event and activate domain-level Protocol #0 routing.`,
      tasks: [
        {
          role: lead,
          priority: 'lead',
          deadline: 'within 5 minutes',
          items: [
            `Receive ${domainName} #0 activation brief`,
            'Confirm trigger source and preliminary characterization',
            `Authorize ${domainName} #0 routing — domain response infrastructure activates`,
            'Convene domain situation room with all assigned stakeholders'
          ]
        },
        {
          role: 'General Counsel',
          priority: 'required',
          deadline: 'within 8 minutes',
          items: [
            'Initial legal exposure assessment for this domain',
            'Confirm privilege protection for situation room communications',
            'Identify external counsel if legal complexity confirmed'
          ]
        }
      ],
      restrictions: [
        'No external communications',
        'No resource commitments until DETECT complete',
        'All communications under privilege'
      ],
      decisionGate: {
        title: 'IDENTIFY → DETECT Gate',
        criteria: [
          `No ${domainName} protocol match confirmed`,
          'Trigger source characterized',
          `${domainName} #0 routing authorized by ${lead}`,
          'All domain stakeholders notified'
        ],
        escalation: `If trigger spans multiple domains, escalate to master Protocol #0 immediately.`
      }
    },
    {
      id: 'phase-2',
      name: 'DETECT: Domain Assessment Framework',
      timeWindow: 'T+0:12 to T+1:00',
      objective: `Deploy ${domainName} domain assessment framework. Map the unknown trigger against all known ${domainName} risk dimensions and surface critical unknowns.`,
      tasks: [
        {
          role: lead,
          priority: 'lead',
          deadline: 'within 20 minutes',
          items: [
            'Structured domain situation assessment — known, unknown, escalation dimensions',
            'Map trigger to closest known risk patterns in this domain',
            'Assign workstream owners for each identified risk dimension',
            'Set first 24-hour objectives and 12-minute execution target'
          ]
        },
        {
          role: 'CFO',
          priority: 'lead',
          deadline: 'within 20 minutes',
          items: [
            'Unlock domain emergency budget envelope',
            'Model financial exposure range for this domain event',
            'Confirm board notification threshold'
          ]
        },
        {
          role: 'PMO Director',
          priority: 'required',
          deadline: 'within 30 minutes',
          items: [
            'Initiate Rapid Protocol Build for this domain',
            'Begin encoding all decisions in real time',
            'Identify closest existing protocol as structural template'
          ]
        }
      ],
      restrictions: [
        'No public statements',
        'All spend requires CFO co-authorization',
        'No execution until domain assessment complete'
      ],
      decisionGate: {
        title: 'DETECT → EXECUTE Gate',
        criteria: [
          'Domain assessment complete',
          'Budget envelope unlocked',
          'Rapid Protocol Build initiated',
          'Board notified if regulatory threshold met'
        ],
        escalation: 'If trigger reveals cross-domain exposure, escalate to master Protocol #0.'
      }
    },
    {
      id: 'phase-3',
      name: 'EXECUTE: Domain-Scoped Response',
      timeWindow: 'T+1:00 to T+12:00',
      objective: `Execute a coordinated first response within the ${domainName} domain. Every decision and outcome is encoded as raw material for the new permanent protocol.`,
      tasks: [
        {
          role: lead,
          priority: 'lead',
          deadline: 'ongoing — 30-minute check-ins',
          items: [
            'Authorize each workstream as confirmed by domain leads',
            'Hold 12-minute execution standard',
            'Maintain decision authority across all domain workstreams',
            'Drive toward first communicable position within 4 hours'
          ]
        },
        {
          role: 'Domain Workstream Owners',
          priority: 'required',
          deadline: 'per workstream authorization',
          items: [
            'Execute assigned workstream with pre-approved budget',
            'Report status every 30 minutes',
            'Capture every decision in the situation log — this becomes the new protocol',
            'Escalate cross-domain dependencies immediately'
          ]
        },
        {
          role: 'PMO Director',
          priority: 'required',
          deadline: 'continuous throughout EXECUTE',
          items: [
            'Encode all decisions, actions, and outcomes in real time',
            'Draft new domain protocol as execution unfolds',
            'Identify trigger criteria and decision gates for the new protocol'
          ]
        }
      ],
      restrictions: [
        'All workstreams require explicit authorization',
        'Every decision logged — no verbal-only decisions',
        'External communications require General Counsel sign-off'
      ],
      decisionGate: {
        title: 'EXECUTE → ADVANCE Gate',
        criteria: [
          'Domain response coordinated and executing',
          'Board briefed on situation and response posture',
          'New protocol draft structure complete',
          'Situation stable enough for close-out planning'
        ],
        escalation: 'If situation is not stabilizing by T+8 hours, escalate to master Protocol #0 and full board session.'
      }
    },
    {
      id: 'phase-4',
      name: 'ADVANCE: New Protocol Build & Library Update',
      timeWindow: 'T+12:00 onward',
      objective: `Formalize the new ${domainName} protocol. Feed learnings back into the full library so every future unknown in this domain is met with stronger infrastructure.`,
      tasks: [
        {
          role: 'PMO Director',
          priority: 'lead',
          deadline: 'within 5 business days',
          items: [
            `Finalize new ${domainName} protocol with complete IDEA Framework structure`,
            'Document trigger criteria and signal patterns for earlier detection',
            'Update affected existing protocols with new cross-domain signals',
            `Submit to ${lead} and General Counsel for review`
          ]
        },
        {
          role: lead,
          priority: 'lead',
          deadline: 'within 10 business days',
          items: [
            `Authorize new ${domainName} protocol for permanent library inclusion`,
            'Conduct post-activation debrief with domain stakeholders',
            'Identify preparation changes that would have accelerated response'
          ]
        },
        {
          role: 'ADVANCE Loop',
          priority: 'required',
          deadline: 'automated on close-out',
          items: [
            'Distribute learnings across all 180 protocols — update signal patterns',
            'Register new detection threshold in detection library',
            'Generate causal hypothesis on response time compression'
          ]
        }
      ],
      restrictions: [
        'New protocol requires lead executive authorization before library inclusion'
      ],
      decisionGate: {
        title: 'ADVANCE Close-Out Gate',
        criteria: [
          'New protocol fully documented',
          `${lead} has authorized library inclusion`,
          'ADVANCE loop has distributed learnings',
          'New detection threshold registered',
          'Board notified'
        ],
        escalation: 'If new protocol reveals systemic gaps (5+ protocols affected), initiate full domain library review.'
      }
    }
  ];
}

const DOMAIN_ZERO_CONFIGS = [
  { number: 0,     code: 'P0-000', domainName: 'AI Governance',          lead: 'CEO',          name: 'Universal Response Protocol',             budget: '5000000', severity: 95, stakeholders: ['CEO', 'COO', 'General Counsel', 'CFO', 'Chief of Staff', 'PMO Director'] },
  { number: 10001, code: 'P0-D1',  domainName: 'Market Dynamics',         lead: 'CEO',          name: 'Unknown Trigger — Market Dynamics',        budget: '2500000', severity: 75, stakeholders: ['CEO', 'CMO', 'Chief Strategy Officer', 'Chief Revenue Officer', 'General Counsel'] },
  { number: 10002, code: 'P0-D2',  domainName: 'Operational Excellence',  lead: 'COO',          name: 'Unknown Trigger — Operational Excellence',  budget: '2500000', severity: 80, stakeholders: ['COO', 'VP Supply Chain', 'VP Operations', 'CFO', 'General Counsel'] },
  { number: 10003, code: 'P0-D3',  domainName: 'Financial Strategy',      lead: 'CFO',          name: 'Unknown Trigger — Financial Strategy',      budget: '2500000', severity: 85, stakeholders: ['CFO', 'CEO', 'General Counsel', 'Board Chair', 'Chief Risk Officer'] },
  { number: 10004, code: 'P0-D4',  domainName: 'Regulatory & Compliance', lead: 'General Counsel', name: 'Unknown Trigger — Regulatory & Compliance', budget: '2000000', severity: 85, stakeholders: ['General Counsel', 'Chief Compliance Officer', 'CEO', 'CFO', 'Board Chair'] },
  { number: 10005, code: 'P0-D5',  domainName: 'Technology & Innovation', lead: 'CTO',          name: 'Unknown Trigger — Technology & Innovation', budget: '2500000', severity: 80, stakeholders: ['CTO', 'CISO', 'COO', 'General Counsel', 'CFO'] },
  { number: 10006, code: 'P0-D6',  domainName: 'Talent & Leadership',     lead: 'CHRO',         name: 'Unknown Trigger — Talent & Leadership',     budget: '1500000', severity: 75, stakeholders: ['CHRO', 'CEO', 'General Counsel', 'COO', 'Board Chair'] },
  { number: 10007, code: 'P0-D7',  domainName: 'Brand & Reputation',      lead: 'CMO',          name: 'Unknown Trigger — Brand & Reputation',      budget: '1500000', severity: 75, stakeholders: ['CMO', 'CEO', 'General Counsel', 'VP Communications', 'Chief Revenue Officer'] },
  { number: 10008, code: 'P0-D8',  domainName: 'Market Opportunities',    lead: 'CEO',          name: 'Unknown Trigger — Market Opportunities',    budget: '2500000', severity: 70, stakeholders: ['CEO', 'CFO', 'Chief Strategy Officer', 'General Counsel', 'Board Chair'] },
  { number: 10009, code: 'P0-D9',  domainName: 'AI Governance',           lead: 'CTO',          name: 'Unknown Trigger — AI Governance',           budget: '2000000', severity: 80, stakeholders: ['CTO', 'Chief AI Officer', 'General Counsel', 'CEO', 'Chief Compliance Officer'] },
];

export async function seedProtocolZeroFamily(): Promise<void> {
  try {
    const allNumbers = DOMAIN_ZERO_CONFIGS.map(c => c.number);

    const existing = await db
      .select({ playbookNumber: playbookLibrary.playbookNumber })
      .from(playbookLibrary)
      .where(inArray(playbookLibrary.playbookNumber, allNumbers));

    const existingSet = new Set(existing.map(e => e.playbookNumber));

    const toInsert = DOMAIN_ZERO_CONFIGS.filter(c => !existingSet.has(c.number));
    if (toInsert.length === 0) {
      console.log('[Protocol #0 Family] All 10 Universal Response Protocols already seeded');
      return;
    }

    const domains = await db.select().from(playbookDomains);
    const domainMap = new Map(domains.map(d => [d.name, d.id]));

    const categories = await db.select().from(playbookCategories);
    const categoryByDomain = new Map<string, string>();
    for (const cat of categories) {
      if (!categoryByDomain.has(cat.domainId)) {
        categoryByDomain.set(cat.domainId, cat.id);
      }
    }

    let inserted = 0;
    for (const cfg of toInsert) {
      const domainId = domainMap.get(cfg.domainName);
      if (!domainId) {
        console.warn(`[Protocol #0 Family] Domain not found: ${cfg.domainName} — skipping ${cfg.name}`);
        continue;
      }

      const categoryId = categoryByDomain.get(domainId);
      if (!categoryId) {
        console.warn(`[Protocol #0 Family] No category for domain ${cfg.domainName} — skipping ${cfg.name}`);
        continue;
      }

      const phases = cfg.number === 0
        ? MASTER_PHASES
        : buildDomainPhases(cfg.domainName, cfg.lead, cfg.stakeholders);

      const isUniversalMaster = cfg.number === 0;
      const description = isUniversalMaster
        ? 'Activates when no existing Readiness Protocol matches the detected trigger. Stages authority chain, budget envelope, external resources, and situation assessment framework within 12 minutes for any first-in-class event.'
        : `Activates when a ${cfg.domainName} trigger fires with no matching Readiness Protocol. Stages domain-scoped authority chain, budget envelope, and assessment framework within 12 minutes.`;

      const whyItMatters = isUniversalMaster
        ? 'The 180 Readiness Protocols cover every known strategic scenario. Protocol #0 covers everything else. Organizations that have never faced a situation before still face it — the difference is whether their first 12 minutes are structured preparation or improvised chaos.'
        : `Protocol #0 for ${cfg.domainName} ensures that even novel, unclassified events in this domain are met with pre-staged infrastructure. The domain is known; the exact situation is not. That distinction compresses the response from 30 days to 12 minutes.`;

      await db.insert(playbookLibrary).values({
        playbookNumber: cfg.number,
        domainId,
        categoryId,
        name: cfg.name,
        description,
        strategicCategory: 'defense',
        triggerCriteria: `Trigger fires with no match in the ${cfg.domainName} Readiness Protocol library`,
        primaryExecutiveRole: cfg.lead,
        severityScore: cfg.severity,
        timeSensitivity: 12,
        activationFrequencyTier: 'RARE',
        tier1Stakeholders: cfg.stakeholders.slice(0, 3) as any,
        tier2Stakeholders: cfg.stakeholders.slice(3) as any,
        tier1Count: 3,
        tier2Count: cfg.stakeholders.length - 3,
        preApprovedBudget: cfg.budget as any,
        primaryResponseStrategy: `${cfg.lead} activates ${cfg.name} — domain assessment framework deployed, authority chain staged, budget envelope unlocked, and external resources activated within 12 minutes of trigger detection.`,
        targetExecutionTime: 12,
        targetResponseSpeed: 12,
        enrichedPhases: phases as any,
        whyItMatters,
        signalSources: [
          'All 180 Readiness Protocol detection thresholds (no-match confirmation)',
          'Real-time signal feed — unclassified pattern detection',
          'Executive escalation from domain monitoring systems'
        ] as any,
        isActive: true,
      });
      inserted++;
    }

    console.log(`[Protocol #0 Family] Seeded ${inserted} Universal Response Protocol(s)`);
  } catch (error) {
    console.error('[Protocol #0 Family] Seed failed (non-fatal):', error);
  }
}
