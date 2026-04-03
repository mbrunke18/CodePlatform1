import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface Phase {
  id: string;
  name: string;
  timeWindow: string;
  objective: string;
  tasks: { role: string; items: string[] }[];
  decisionGate: { title: string; criteria: string[]; escalation: string };
  restrictions: string[];
}

const PLAYBOOK_PHASES: Record<string, Phase[]> = {

  // ── AI Competitive Disruption (PUBLIC playbook — highest priority) ──────────
  'da7df303-a5bd-4fc0-a8b7-492f8619c500': [
    {
      id: 'phase-1', name: 'DETECT & VALIDATE', timeWindow: '0–4h',
      objective: 'Confirm AI competitive threat is material; characterize capability, deployment speed, and customer targeting before committing resources.',
      tasks: [
        { role: 'Chief Strategy Officer', items: [
          'Pull competitor AI product page, launch blog post, technical documentation, and any academic papers cited; extract claimed capabilities, accuracy benchmarks, integration targets, and pricing model in a 1-page brief',
          'Map overlap with your own AI roadmap: list each competitor AI feature and mark as (a) parity, (b) we lead, or (c) competitor leads — document gaps with estimated build time and cost',
          'Run LinkedIn hiring scan for competitor AI/ML roles posted in last 90 days; cross-reference with job descriptions to infer what capabilities are in build vs. deployed',
          'Identify top 20 accounts most exposed: segment by contract renewal date, current product usage depth, and likelihood to evaluate competitor AI features; flag any where competitive pitch is already confirmed',
        ]},
        { role: 'CTO / Chief Product Officer', items: [
          'Convene 2-hour technical review with ML leads and product architects: benchmark competitor AI claims against your stack (latency, accuracy, data requirements, integration depth)',
          'Assess replication time: for each competitor AI capability that represents a gap, estimate sprint count and engineering cost to reach parity or exceed',
          'Identify your proprietary data assets and model differentiation that competitor cannot replicate within 12 months — these are the defensible moat points for customer messaging',
        ]},
        { role: 'CISO', items: [
          'Review competitor data handling and model training disclosures for any privacy, security, or IP concerns that can be cited in customer-facing competitive positioning',
          'Confirm your AI deployment SOC 2, ISO 27001, and sector-specific compliance certifications are current and documented for customer inquiries',
        ]},
      ],
      decisionGate: {
        title: 'Is this an existential AI capability threat requiring immediate executive mobilization?',
        criteria: [
          'Competitor AI capability closes a gap you previously held as a 6-month+ lead on your top 10 accounts evaluation criteria',
          'At least 3 enterprise accounts have already received a competitor AI demo or been contacted by competitor sales',
          'Competitor has sufficient capital runway (18+ months) and GTM infrastructure to execute aggressive enterprise sales',
        ],
        escalation: 'If 2+ criteria are met, CEO convenes emergency strategy huddle within 4 hours with CPO, CTO, CMO, and CFO to authorize counter-disruption investment and release up to $750K from pre-approved budget.'
      },
      restrictions: [
        'No public statements, press releases, or social posts acknowledging the competitor AI product until Legal and CEO approve a coordinated response narrative.',
        'Do not contact shared customers preemptively until messaging is approved — uncoordinated outreach amplifies competitor visibility.',
        'No commitment to accelerated product delivery dates until engineering has confirmed feasibility in writing.',
      ]
    },
    {
      id: 'phase-2', name: 'ASSEMBLE WAR ROOM', timeWindow: '4–24h',
      objective: 'Mobilize cross-functional response team, brief board, establish decision authority, and lock initial counter-positioning.',
      tasks: [
        { role: 'CEO', items: [
          'Convene War Room: CEO, CPO, CTO, CMO, CFO, CLO, CISO, VP Sales, VP Customer Success — establish weekly cadence for next 90 days with CEO as decision authority on all AI strategy pivots',
          'Brief board chair and lead independent director via 30-minute call: frame threat level, initial response strategy, and budget request; document board guidance on risk tolerance and investment appetite',
          'Determine whether competitive response warrants a press or analyst briefing — if yes, set timing and key messages with CMO and General Counsel',
        ]},
        { role: 'Chief Product Officer', items: [
          'Convene emergency roadmap review: identify top 3 AI capabilities to accelerate; estimate what it would take to ship each in half the planned time; surface trade-offs (deferred features, engineering cost, quality risk)',
          'Identify any partner or acquisition targets that could close the capability gap faster than organic build — produce a 3-option brief (build / buy / partner) with cost and timeline for each',
          'Pull current AI product feedback from top 20 accounts: what are they asking for that competitor now claims to offer? Prioritize that list against roadmap.',
        ]},
        { role: 'CMO / VP Communications', items: [
          'Draft counter-positioning brief: 3 proof points where your AI leads, 3 risk factors in competitor approach, and your differentiated data and security story — Legal review required before distribution',
          'Brief top 10 field sales reps on competitive objection handling; prepare 2-page competitive battlecard with talk tracks for the 5 most likely customer objections',
          'Identify 3 customer advocates willing to speak publicly about your AI capabilities — coordinate reference program activation within 48 hours',
        ]},
        { role: 'CFO', items: [
          'Model three counter-investment scenarios: (1) defensive — protect existing base, (2) offensive — accelerated roadmap plus partnership, (3) transformative — M&A or major platform shift; estimate 18-month cost and risk for each',
        ]},
      ],
      decisionGate: {
        title: 'Authorize counter-AI investment and strategic response path',
        criteria: [
          'Build / buy / partner brief reviewed by CEO and CFO with a selected option',
          'Accelerated roadmap commitments reviewed by CTO with engineering sign-off on feasibility',
          'Competitive messaging brief approved by Legal and CEO',
        ],
        escalation: 'CEO makes final investment decision within 24 hours of War Room assembly. If board funding approval required (above $2M), CEO contacts board chair for emergency board vote within 48 hours.'
      },
      restrictions: [
        'No M&A conversations without board authorization and NDAs executed by General Counsel.',
        'Do not commit to specific AI capability delivery dates in customer or press communications until engineering has confirmed.',
        'All competitive battlecard content must clear Legal before distribution to sales — no ad-hoc materials.',
      ]
    },
    {
      id: 'phase-3', name: 'STRATEGY LOCK', timeWindow: '24–72h',
      objective: 'Finalize and fund counter-disruption strategy; deploy customer protection program; accelerate key roadmap deliverables.',
      tasks: [
        { role: 'CEO + CFO', items: [
          'Finalize and authorize counter-disruption budget; issue approval memo to CPO and CTO with spend parameters and reporting cadence',
          'Brief all VPs and directors: communicate the approved strategy, the investment being made, and the 90-day milestones that signal success — prevent internal uncertainty from leaking externally',
        ]},
        { role: 'VP Sales + VP Customer Success', items: [
          'Execute top-account protection play: personal outreach from VP+ to all accounts flagged in Phase 1 within 72 hours; offer executive briefing on AI roadmap with confidential preview of upcoming capabilities',
          'Identify accounts at risk of renewal delay due to competitive evaluation; engage CFO on retention pricing tools (loyalty discounts, extended terms, bundled features)',
          'Track competitor activity in pipeline daily for next 30 days: any deal where competitor AI is mentioned goes on weekly CEO loss-risk report',
        ]},
        { role: 'Chief Product Officer + CTO', items: [
          'Finalize accelerated roadmap: identify the 90-day AI capability releases that anchor your counter-narrative; communicate timeline to CEO and CMO for external messaging alignment',
          'If partnership path selected: reach out to top 2 target partners under NDA within 72 hours; use pre-approved term sheet template from General Counsel',
        ]},
        { role: 'CMO', items: [
          'Launch AI leadership content program: 3 thought leadership pieces (whitepapers, analyst briefings, or customer case studies) demonstrating AI differentiation — target publication within 30 days',
          'Brief Gartner, Forrester, and IDC analysts on AI roadmap under NDA; request competitive category positioning briefings',
        ]},
      ],
      decisionGate: {
        title: 'Strategic response is funded, communicated, and in execution',
        criteria: [
          'Budget authorized by CEO and CFO and communicated to CPO and CTO',
          'Top 20 at-risk accounts contacted by VP+ within 72 hours',
          'Accelerated roadmap locked with engineering and communicated internally',
        ],
        escalation: 'If any top 5 account issues a competitive RFP or schedules competitor demo before Phase 3 completes, CEO personally calls account executive within 24 hours.'
      },
      restrictions: [
        'Do not publicly announce accelerated roadmap commitments until Legal has reviewed for forward-looking statement liability.',
        'Retention pricing offers require CFO pre-approval; no ad-hoc discounts above standard policy.',
        'All analyst briefings under NDA — no proprietary roadmap shared publicly.',
      ]
    },
    {
      id: 'phase-4', name: 'EXECUTE & DOCUMENT', timeWindow: '72h–30 days',
      objective: 'Monitor competitive response effectiveness, track at-risk accounts, capture learnings for next disruption cycle.',
      tasks: [
        { role: 'CEO', items: [
          'Weekly War Room check-in for first 30 days: review account loss-risk report, roadmap progress, and competitive intelligence update',
          'Thirty-day debrief: assess whether initial threat characterization was accurate; document what you knew, when you knew it, and what the response cost vs. what it protected',
        ]},
        { role: 'VP Sales', items: [
          'Track every deal where competitor AI is mentioned; close 90-day win/loss report segmented by: (a) competitive deals won, (b) lost to AI competitor, (c) delayed due to evaluation',
          'Collect verbatim customer feedback from accounts that evaluated competitor AI: what features were they evaluating, what did they ultimately decide, and why',
        ]},
        { role: 'Chief Product Officer', items: [
          'Monthly roadmap progress report against accelerated commitments: on-track, at-risk, or delayed with root cause',
          'Document all AI competitive intelligence into institutional playbook for next disruption cycle — update this playbook with lessons learned',
        ]},
      ],
      decisionGate: {
        title: '30-day review: Is the competitive threat contained or escalating?',
        criteria: [
          'Account loss rate to AI competitor is 2% or less of ARR in first 30 days',
          'Accelerated roadmap on track with 80%+ of 90-day milestones confirmed',
          'No new strategic accounts have initiated competitor AI evaluation processes',
        ],
        escalation: 'If account loss rate exceeds 5% ARR or 2 strategic accounts confirm switching decision, CEO convenes board for emergency strategy review and potential M&A authorization.'
      },
      restrictions: [
        'All competitive intelligence must be gathered through legal channels — no unauthorized access to competitor systems or documents.',
        'Win/loss data is confidential: distribute only to CEO, CPO, CMO, VP Sales — not shared externally.',
      ]
    },
  ],

  // ── Data Breach (Customer Data) ───────────────────────────────────────────────
  '9fcd35b7-c5db-49ec-8162-ff8e42d1f363': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm breach scope and data types affected; isolate compromised systems; preserve forensic evidence; activate legal counsel.',
      tasks: [
        { role: 'CISO', items: [
          'Confirm breach: validate detection source (SIEM alert, pen-test finding, third-party report, or customer complaint); document timestamp of suspected breach vs. detection; preserve all logs and alerts in write-once storage immediately',
          'Isolate affected systems: segment compromised networks and accounts without full shutdown unless active exfiltration is ongoing; coordinate with IT to disable compromised credentials while preserving forensic state',
          'Classify data affected: identify data types (PII, PHI, financial, authentication credentials, trade secrets); cross-reference with data inventory to estimate record count and customer population affected',
          'Engage external forensic firm from pre-approved vendor roster within 2 hours; provide immediate access to affected systems; establish chain of custody for all evidence',
        ]},
        { role: 'General Counsel / CLO', items: [
          'Activate breach response legal team: notify outside privacy counsel within 1 hour; confirm engagement scope and privilege protections for all breach-related communications',
          'Begin regulatory notification clock analysis: identify all applicable notification obligations (GDPR 72h, state laws, HIPAA 60 days, SEC 4 days if material); document jurisdiction and timelines in a notification matrix',
          'Issue litigation hold to CISO, IT, and all relevant custodians: preserve all systems, logs, communications, and documentation related to the breach — no deletion or alteration',
        ]},
        { role: 'CEO', items: [
          'Notify board chair and lead director within 2 hours of breach confirmation; brief on scope, immediate actions taken, and preliminary materiality assessment',
          'Authorize incident command structure: designate Incident Commander (CISO or COO), establish bridge line and response channel restricted to breach response team only',
        ]},
      ],
      decisionGate: {
        title: 'Is this breach material and does it require immediate regulatory notification and public disclosure?',
        criteria: [
          'Confirmed exfiltration or unauthorized access to customer PII, PHI, payment data, or authentication credentials affecting 500+ individuals',
          'Affected systems include production environment, authentication infrastructure, or regulated data stores',
          'Breach involves a nation-state actor, ransomware, or supply-chain compromise requiring SEC 4-day disclosure analysis',
        ],
        escalation: 'If 2+ criteria met, CEO escalates to full breach protocol: notify board within 2 hours, engage PR crisis firm, and begin drafting customer notification with outside counsel. CFO notified for insurance claim initiation.'
      },
      restrictions: [
        'No external communication about the breach — to customers, press, or regulators — without General Counsel approval and CEO sign-off.',
        'Do not shut down or wipe compromised systems until forensic firm has confirmed evidence preservation — destruction of evidence creates additional legal liability.',
        'All breach response communications must go through outside counsel to maintain attorney-client privilege.',
        'Do not pay ransom without board authorization and FBI/CISA consultation.',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Mobilize full breach response team; complete scope assessment; engage cyber insurance; prepare regulatory notifications.',
      tasks: [
        { role: 'CISO + Forensic Firm', items: [
          'Complete affected system inventory: document every system, database, and API that had access to compromised data; build timeline of attacker activity from initial access to detection',
          'Identify attack vector: phishing, credential stuffing, third-party compromise, insider threat, or zero-day; document findings with forensic evidence for regulatory response',
          'Patch or remediate attack vector if identified; if zero-day or unknown vector, implement compensating controls and expand monitoring across adjacent systems',
          'Produce preliminary scope report: record count, data types, customer and employee breakdown, and geographic distribution of affected individuals — required for notification volume and regulatory jurisdiction analysis',
        ]},
        { role: 'CFO', items: [
          'Notify cyber insurance carrier within 24 hours per policy requirements; engage carrier panel counsel and forensic firm if required by policy',
          'Establish breach cost tracking account: all response costs (forensics, legal, notification, credit monitoring, PR) must be documented for insurance recovery and board reporting',
          'Assess financial materiality threshold for SEC 8-K/10-K disclosure with outside counsel and CFO',
        ]},
        { role: 'General Counsel + Outside Counsel', items: [
          'File preliminary internal notification matrix: for each jurisdiction with affected individuals, document the specific law, threshold met, notification timing, and regulatory contact',
          'Begin drafting customer notification letter: must include what happened, what data was involved, what we are doing, and what customers can do — Legal, CEO, and CISO must all approve final version',
          'Assess D&O exposure and review directors insurance coverage in context of breach events',
        ]},
        { role: 'CMO / VP Communications + PR Firm', items: [
          'Engage PR crisis firm from pre-approved roster if breach is likely to be public; brief firm under NDA on scope and timeline',
          'Draft holding statement for press inquiries: Legal approval required before any media response',
          'Prepare customer service team script for breach inquiries; train customer service leads within 12 hours',
        ]},
      ],
      decisionGate: {
        title: 'Authorize regulatory notification filings and customer notification program',
        criteria: [
          'Forensic scope report confirms record count and data types with reasonable certainty',
          'Notification matrix approved by outside counsel with jurisdiction-specific timelines',
          'Customer notification letter reviewed and approved by General Counsel and CEO',
        ],
        escalation: 'If GDPR 72-hour clock is running and scope is not confirmed, General Counsel files preliminary notification to applicable supervisory authorities with known facts to preserve compliance.'
      },
      restrictions: [
        'Customer notification letters must not be sent before General Counsel final approval — incorrect disclosures increase liability.',
        'Do not confirm breach to press or social media — direct all inquiries to approved holding statement.',
        'All regulatory filings must be reviewed by outside counsel in each jurisdiction — no self-filing without counsel sign-off.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'Complete forensic investigation; file required regulatory notifications; deploy customer protection program; remediate systems.',
      tasks: [
        { role: 'CISO + Forensic Firm', items: [
          'Complete forensic investigation: produce final scope report with attack timeline, data accessed, attacker persistence mechanisms found and removed, and IoCs for threat intelligence sharing',
          'Remediate all compromised systems: rotate all affected credentials, patch exploited vulnerabilities, remove attacker persistence, and validate remediation with independent scan',
          'Conduct tabletop exercise with IT and Security teams post-remediation: validate that detection controls would have caught this attack sooner; identify control gaps to close within 30 days',
        ]},
        { role: 'General Counsel + Outside Counsel', items: [
          'File all required regulatory notifications per jurisdiction timeline: GDPR supervisory authority, State AGs, HHS OCR (if PHI), SEC (if material), FTC (if applicable)',
          'Coordinate with FBI/CISA if nation-state or ransomware involvement confirmed — engagement is confidential and does not trigger additional disclosure obligations',
          'Document all regulatory filings, timelines, and correspondence for future audit defense',
        ]},
        { role: 'CMO / VP Customer Success', items: [
          'Launch customer notification program: send approved notification letter to all affected individuals; offer credit monitoring (12–24 months based on data sensitivity) via pre-negotiated provider',
          'Stand up dedicated breach response hotline with trained agents; publish FAQ page on breach microsite; monitor social media for customer complaints and respond per Legal-approved script',
          'Brief key enterprise customers (top 50 by ARR) directly before mass notification goes out: VP+ call with each; Legal-approved script; offer dedicated support contact',
        ]},
      ],
      decisionGate: {
        title: 'Is the breach fully contained and remediated?',
        criteria: [
          'Independent security scan confirms no attacker persistence and all attack vectors closed',
          'All required regulatory notifications filed per applicable deadlines',
          'All affected individuals notified or notification program actively underway',
        ],
        escalation: 'If attacker persistence is found after initial remediation, CISO escalates to CEO and board immediately; consider engaging CISA and reassessing public disclosure timeline.'
      },
      restrictions: [
        'Do not declare breach "contained" publicly until forensic firm and CISO have confirmed in writing.',
        'Credit monitoring offers must be activated per terms negotiated — confirm activation codes before customer notification goes out.',
        'All regulatory correspondence is privileged — distribute to breach response team only, not broader company.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '72h–90 days',
      objective: 'Complete regulatory compliance; restore full operations; execute systemic security improvements; conduct post-incident review.',
      tasks: [
        { role: 'CISO', items: [
          'Deploy 30-day security remediation roadmap: address all control gaps identified in forensic report with documented owner, deadline, and completion verification',
          'Implement enhanced monitoring for 90 days post-breach: expanded log retention, additional threat detection rules, weekly vulnerability scans on all production systems',
          'Prepare post-incident report for board: attack narrative, scope, total response cost, regulatory status, control improvements implemented, and estimated risk reduction',
        ]},
        { role: 'General Counsel', items: [
          'Monitor and respond to any regulatory follow-up requests within required timeframes; maintain detailed record of all correspondence',
          'Assess litigation risk: engage litigation counsel to evaluate class action exposure; assess whether early settlement program is appropriate given scope and jurisdiction',
          'Update cyber insurance policy at next renewal: notify carrier of security improvements; reassess coverage limits based on breach cost experience',
        ]},
        { role: 'CEO', items: [
          'Ninety-day board debrief: comprehensive post-incident review including cost, regulatory outcome, customer retention impact, and security investment plan for next 12 months',
          'Update executive team on security investment priorities for next fiscal year — signal organizational commitment to security',
        ]},
        { role: 'CMO', items: [
          'Assess customer retention impact at 30 and 60 days post-notification: track churn rate, NPS change, and customer service inquiry volume as breach-related metrics',
          'Develop trust-rebuilding communications program: security improvement announcements, third-party audit results, customer transparency report — publish within 90 days',
        ]},
      ],
      decisionGate: {
        title: '90-day review: Is the organization secure, compliant, and operationally recovered?',
        criteria: [
          'All 30-day security remediation items complete with verification',
          'All regulatory notifications complete and no open enforcement actions pending',
          'Customer retention within 5% of pre-breach baseline',
        ],
        escalation: 'If regulatory enforcement action is initiated or class action certified, CLO convenes monthly litigation steering committee with CEO and CFO.'
      },
      restrictions: [
        'Do not publish external lessons learned or post-incident report without Legal review — can be used as evidence in litigation.',
        'All customer retention data and breach financial impact figures are confidential — board and exec team only.',
      ]
    },
  ],

  // ── CEO Sudden Departure ───────────────────────────────────────────────────────
  '3dfecf58-e93c-4a3b-b712-f2a9d4a77ed0': [
    {
      id: 'phase-1', name: 'SITUATION CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm departure facts; invoke board authority; appoint interim leadership; contain information until coordinated announcement.',
      tasks: [
        { role: 'Board Chair', items: [
          'Convene emergency board session within 2 hours: confirm departure circumstances (resignation, termination, incapacitation, or death); determine board posture (orderly transition vs. crisis)',
          'Invoke CEO succession protocol per board charter: confirm interim CEO authority, scope of decision-making power, and board reporting cadence during transition',
          'Designate board spokesperson and internal communications lead — no other director speaks publicly about the departure without board chair approval',
          'Contact General Counsel immediately: review employment agreement, severance terms, non-disparagement obligations, equity treatment, and any potential claims; execute separation agreement where applicable',
        ]},
        { role: 'General Counsel / CLO', items: [
          'Review and advise board on: (a) employment contract terms and severance obligations, (b) D&O insurance implications, (c) SEC disclosure requirements — 8-K if public company, (d) any for-cause findings and documentation requirements',
          'Issue immediate document hold on all CEO-related communications, contracts, and systems; secure CEO email, files, and devices through IT within 4 hours',
          'Assess any non-compete, non-solicitation, and confidentiality obligations relevant to departure circumstances',
        ]},
        { role: 'CFO', items: [
          'Confirm banking, treasury, and financial instrument authority: update authorized signatories on all bank accounts and credit facilities within 4 hours',
          'Notify auditors and audit committee chair of CEO transition for financial controls documentation',
          'Review any financial disclosures, earnings guidance, or investor communications that may require updating as a result of departure',
        ]},
      ],
      decisionGate: {
        title: 'Is interim leadership confirmed and information contained pending coordinated announcement?',
        criteria: [
          'Interim CEO officially designated by board resolution with documented authority scope',
          'All financial authorities updated and access controls adjusted within 4 hours',
          'General Counsel has confirmed disclosure obligations and timeline',
        ],
        escalation: 'If departure involves potential misconduct, fraud, or regulatory violation, board chair engages independent outside counsel immediately and suspends any separation agreement negotiations pending investigation.'
      },
      restrictions: [
        'No employee, executive, or board member communicates about the CEO departure — internally or externally — before the coordinated announcement is approved by board chair and General Counsel.',
        'Do not delete or alter any CEO-related communications or documents — litigation hold is in effect from the moment of departure.',
        'Separation agreement negotiations must not be interpreted as admissions — all settlement discussions are privileged.',
      ]
    },
    {
      id: 'phase-2', name: 'INTERNAL STABILIZATION', timeWindow: '4–24h',
      objective: 'Announce transition to employees; stabilize executive team; ensure operational continuity; brief key customers and partners.',
      tasks: [
        { role: 'Board Chair + Interim CEO', items: [
          'Deliver all-employee communication: board chair message that is honest, forward-looking, and confident; do not over-explain departure circumstances; focus on continuity and the strength of the leadership team',
          'Convene executive team within 2 hours of announcement: interim CEO sets expectations, confirms reporting structure, and addresses team questions; board chair participates to signal confidence',
          'Identify executive retention risks — team members closely aligned with departing CEO; interim CEO conducts 1:1s within 24 hours',
        ]},
        { role: 'CHRO', items: [
          'Assess succession bench: identify internal candidates for permanent CEO role and their readiness timeline; provide preliminary brief to board compensation committee within 24 hours',
          'Engage executive search firm from pre-approved roster if external search is anticipated; execute NDA and initiate search brief within 48 hours',
          'Communicate transition timeline to direct reports and key department heads; provide clarity on decision authority during interim period',
        ]},
        { role: 'CMO / VP Communications', items: [
          'Prepare investor relations communication: draft 8-K language with CFO and General Counsel for SEC filing; prepare earnings call script update if applicable',
          'Draft customer-facing communication for tier-1 accounts (top 50 by ARR): personalized note from interim CEO or board chair; VP Customer Success delivers personal calls within 24 hours',
          'Prepare press statement for media inquiries: factual, confident, forward-looking — do not speculate on reasons for departure',
        ]},
        { role: 'CFO', items: [
          'Brief lenders, major investors, and analysts per investor relations protocol — preempt leaks with controlled disclosure',
          'Assess any covenant triggers or material adverse change provisions in credit agreements related to CEO change; notify counsel and lenders if triggered',
        ]},
      ],
      decisionGate: {
        title: 'Is the organization operationally stable and is the external announcement coordinated?',
        criteria: [
          'All-employee communication delivered within 12 hours of departure confirmation',
          'Tier-1 customers contacted personally within 24 hours',
          'SEC filing (if required) prepared and filed within regulatory timeline',
        ],
        escalation: 'If any leak to press occurs before coordinated announcement, CMO and board chair execute accelerated announcement immediately rather than allowing narrative to be set by incomplete information.'
      },
      restrictions: [
        'Do not characterize the departure with vague language unless it is accurate — misleading disclosure creates regulatory risk.',
        'Interim CEO does not have authority to make strategic pivots, major acquisitions, or significant personnel changes without board approval during transition period.',
        'Executive search process is confidential — candidate names and search firm identity not disclosed externally.',
      ]
    },
    {
      id: 'phase-3', name: 'EXTERNAL COMMUNICATION', timeWindow: '24–72h',
      objective: 'Execute investor and media strategy; manage board search process; maintain customer and partner confidence.',
      tasks: [
        { role: 'Board Chair + CFO', items: [
          'Conduct investor calls: proactive outreach to top 20 institutional shareholders; board chair and CFO present transition plan, interim CEO qualifications, and search timeline',
          'Prepare and file 8-K (if public company): include departure date, interim CEO appointment, and any material information required by SEC regulations',
          'Brief rating agencies if applicable; prepare response to any analyst downgrade risk related to leadership uncertainty',
        ]},
        { role: 'Interim CEO', items: [
          'Conduct listening tour: 1:1s with top 10 customers (by ARR) and top 5 strategic partners within 72 hours; focus on relationship continuity and strategic commitment confirmation',
          'Publish interim priorities memo to all employees: top 3 operational focus areas for transition period; signals stability and avoids vacuum of direction',
        ]},
        { role: 'CHRO + Board Compensation Committee', items: [
          'Finalize CEO search parameters: internal vs. external, compensation range, board timeline for decision, and CEO profile (turnaround vs. growth vs. transformation)',
          'Retain executive search firm and initiate formal search process with defined milestones and board review cadence',
        ]},
      ],
      decisionGate: {
        title: 'Is external confidence maintained and the CEO search formally underway?',
        criteria: [
          'Top 20 institutional investors briefed within 72 hours with no major sell-off signals',
          'Customer retention and contract renewal activity is normal or only slightly elevated',
          'CEO search firm retained and search brief approved by board',
        ],
        escalation: 'If significant stock price decline (15%+) or customer escalation from top 5 accounts occurs within 72 hours, board chair conducts additional investor and customer outreach and reassesses search timeline acceleration.'
      },
      restrictions: [
        'Do not set a public CEO search timeline unless board is confident it can be met — missing a promised deadline amplifies uncertainty.',
        'Interim CEO must not make public statements that could be interpreted as campaigning for the permanent role.',
      ]
    },
    {
      id: 'phase-4', name: 'SUCCESSION EXECUTION', timeWindow: '30–90 days',
      objective: 'Complete CEO search; onboard new CEO; transition interim leadership; document institutional knowledge.',
      tasks: [
        { role: 'Board Compensation Committee', items: [
          'Drive CEO search to conclusion: weekly search committee meetings; target final candidate slate within 45 days; board vote within 60 days where feasible',
          'Negotiate new CEO employment package: base, bonus, equity, sign-on, severance, and any non-standard provisions — requires full board ratification',
          'Conduct thorough reference and background check on finalist candidate: board members contact references personally; engage third-party background firm',
        ]},
        { role: 'Interim CEO', items: [
          'Prepare comprehensive CEO transition brief: state of all active strategic initiatives, key relationship maps, open decisions awaiting resolution, and cultural observations for incoming CEO',
          'Do not initiate major strategic changes or personnel decisions during final 30 days of interim period without board approval — preserve new CEO optionality',
        ]},
        { role: 'CHRO', items: [
          'Design new CEO onboarding program: 90-day board, executive, and customer immersion schedule; assign executive coach; establish early performance milestones',
          'Assess and address any organizational changes new CEO may require; prepare org chart scenarios for new CEO consideration',
        ]},
      ],
      decisionGate: {
        title: 'Is the new CEO appointed, transitioned, and the organization fully stabilized?',
        criteria: [
          'New CEO announced and employment agreement executed',
          'Interim CEO transition brief delivered and accepted by new CEO',
          'No significant executive departures or customer losses attributable to leadership transition',
        ],
        escalation: 'If CEO search extends beyond 90 days without a final candidate, board chair publishes updated timeline to investors and employees; re-evaluates interim CEO extension terms and search firm performance.'
      },
      restrictions: [
        'New CEO announcement requires coordinated investor relations, employee, and press communication on the same day — no leaks before announcement day.',
        'Severance and separation terms for departing CEO are confidential — not shared outside board and General Counsel.',
      ]
    },
  ],

  // ── Financial Services Compliance Breach ──────────────────────────────────────
  '0c24ec43-f55b-445f-9ecd-b324ca9dc6a4': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm the compliance breach, classify its severity, and activate legal and regulatory response protocols.',
      tasks: [
        { role: 'Chief Compliance Officer', items: [
          'Confirm breach: identify the specific regulatory requirement violated (BSA/AML, FINRA, SEC, OCC, CFPB, or FDIC regulation); document the exact provision, the period of non-compliance, and the circumstances of discovery',
          'Classify severity: assess whether breach is (a) technical/minor with no customer harm, (b) systemic with potential customer harm, or (c) willful/repeated violation requiring escalated enforcement response',
          'Preserve all documentation: issue hold on all relevant transaction records, communications, audit logs, and compliance reports — do not delete or alter any records from the affected period',
        ]},
        { role: 'General Counsel / CLO', items: [
          'Engage specialized financial regulatory outside counsel within 2 hours; confirm privilege protection for all breach-related investigation and communications',
          'Assess voluntary disclosure: evaluate whether voluntary self-disclosure to the primary regulator is required, advantageous, or strategically advisable given breach severity and existing regulatory relationships',
          'Review examiner relationships and pending examination schedule: if a regulatory exam is scheduled within 90 days, disclosure timeline becomes urgent',
        ]},
        { role: 'CEO + CFO', items: [
          'Notify board audit committee chair within 2 hours; brief on nature of breach, preliminary scope, and planned response',
          'Notify external auditors if breach may affect financial statement disclosures or going concern assessments',
        ]},
      ],
      decisionGate: {
        title: 'Does this compliance breach require immediate regulatory notification or voluntary disclosure?',
        criteria: [
          'Breach involves a specific regulatory provision that mandates self-reporting within a defined timeframe',
          'Breach has resulted in customer financial harm, unauthorized transactions, or data exposure affecting regulated accounts',
          'Breach is systemic (pattern of violations over time) rather than isolated, suggesting potential enforcement action risk',
        ],
        escalation: 'If 2+ criteria are met, CLO convenes emergency response team within 4 hours: CEO, CFO, CCO, CLO, outside counsel. Board audit committee briefed within 24 hours with formal memo.'
      },
      restrictions: [
        'No communication with regulators — written or verbal — without outside regulatory counsel review and approval.',
        'Do not destroy, alter, or "clean up" any records from the affected period — obstruction compounds liability significantly.',
        'All analysis of the breach is privileged — mark all documents "Privileged and Confidential — Attorney Work Product."',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Complete internal investigation; prepare regulatory response; assess financial exposure and reserves.',
      tasks: [
        { role: 'Chief Compliance Officer + Outside Counsel', items: [
          'Conduct accelerated internal investigation: pull all transaction data, compliance reports, and audit findings for the affected period; identify root cause (system failure, process gap, training failure, or oversight failure)',
          'Quantify scope: total number of affected transactions, customers, and dollar amounts involved; identify whether third parties or correspondent banks are involved',
          'Produce preliminary investigation memo under privilege: root cause, scope, timeline, and preliminary remediation recommendations — required for regulatory response preparation',
        ]},
        { role: 'CFO', items: [
          'Assess financial exposure: estimate potential civil money penalties using regulatory penalty schedules; consult outside counsel on likely penalty range given breach type and cooperation credit',
          'Notify financial institution insurer and D&O carrier per policy requirements; evaluate errors and omissions coverage applicability',
          'Assess whether financial exposure requires disclosure in financial statements or earnings guidance revision',
        ]},
        { role: 'CEO + Board Audit Committee', items: [
          'Convene board audit committee briefing within 24 hours: present investigation findings, regulatory timeline, financial exposure, and remediation plan',
          'Determine voluntary disclosure decision: board must formally approve or decline voluntary self-disclosure recommendation from outside counsel; document board deliberation and rationale',
        ]},
      ],
      decisionGate: {
        title: 'Authorize regulatory response strategy and remediation program',
        criteria: [
          'Internal investigation has characterized root cause with sufficient certainty to inform remediation',
          'Outside counsel has advised on voluntary disclosure timeline and strategic impact',
          'Board audit committee has formally deliberated and documented voluntary disclosure decision',
        ],
        escalation: 'If investigation reveals senior management involvement or knowledge of breach prior to discovery, board chair convenes independent investigation under outside counsel without management participation.'
      },
      restrictions: [
        'No voluntary disclosure filing without board audit committee formal approval and outside regulatory counsel sign-off.',
        'CCO and CLO are the only authorized spokespersons in any regulatory communications — no other executives contact regulators without authorization.',
        'Financial exposure estimates are preliminary and privileged — not shared in board minutes or earnings materials without CLO approval.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'Implement interim controls; file required regulatory notifications; prepare for regulatory examination.',
      tasks: [
        { role: 'Chief Compliance Officer', items: [
          'Implement interim controls: deploy manual overrides, enhanced monitoring, or system patches to prevent recurrence pending permanent fix; document all interim controls for regulatory review',
          'Prepare regulatory examination package: organize all documentation requested in standard examination request lists for the applicable regulator; prepare compliance team for examiner interviews',
          'Update compliance risk assessment and board compliance report with breach findings and remediation status',
        ]},
        { role: 'General Counsel + Outside Regulatory Counsel', items: [
          'Execute voluntary disclosure (if approved): prepare formal submission per regulator-specific protocols; include root cause, scope, interim controls, and remediation timeline; request meeting with examination staff',
          'If mandatory reporting deadlines apply: file required reports within prescribed timeframes',
          'Prepare examination defense strategy: document cooperation timeline, remediation milestones, and any mitigating factors for penalty calculation',
        ]},
        { role: 'CEO + Board', items: [
          'Approve and communicate remediation plan to all affected business lines: resource allocation, timeline, accountability assignments, and board oversight structure for compliance program rebuild',
          'Determine whether public disclosure is required (public company 8-K for material regulatory actions, or press release for customer-facing compliance failures)',
        ]},
      ],
      decisionGate: {
        title: 'Are interim controls in place and regulatory communications filed?',
        criteria: [
          'Interim controls deployed and tested; recurrence risk mitigated',
          'All mandatory regulatory notifications filed within required timeframes',
          'Regulatory examination package prepared and outside counsel briefed on examination defense',
        ],
        escalation: 'If regulators initiate formal enforcement action before voluntary disclosure is completed, CLO and outside counsel convene immediate response team and notify CEO and board within 2 hours.'
      },
      restrictions: [
        'Interim controls must be documented and explained to regulators — undisclosed controls cannot be credited in enforcement negotiations.',
        'Do not agree to any consent order or enforcement settlement without full board approval.',
        'Customer-facing communication about the compliance breach requires CLO and CEO approval.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '30–180 days',
      objective: 'Resolve regulatory action; implement permanent program fixes; rebuild compliance infrastructure; conduct post-incident review.',
      tasks: [
        { role: 'Chief Compliance Officer', items: [
          'Implement permanent compliance program remediation: new controls, technology solutions, enhanced testing, and training program — all with documented effectiveness testing',
          'Establish board compliance committee with enhanced reporting: quarterly compliance reports to board; monthly reporting during remediation period',
          'Conduct look-back review as required by regulator: quantify all transactions affected during breach period; prepare remediation payments or customer restitution if required',
        ]},
        { role: 'General Counsel + Outside Counsel', items: [
          'Negotiate enforcement resolution: consent order, civil money penalty, or formal agreement; target cooperation credit for voluntary disclosure and remediation',
          'Monitor and satisfy all consent order requirements with documented milestones; failure to satisfy terms escalates to more severe enforcement action',
          'Assess litigation risk from customers or shareholders; engage litigation counsel if class action is filed',
        ]},
        { role: 'CEO + Board', items: [
          'Post-incident board review at 90 days: total cost, regulatory relationship assessment, compliance program maturity improvement, and executive accountability decisions',
          'Review and strengthen compliance committee structure and CCO reporting line — many enforcement actions result from inadequate board-level compliance oversight',
        ]},
      ],
      decisionGate: {
        title: 'Is the regulatory matter resolved and the compliance program rebuilt to higher standards?',
        criteria: [
          'Formal enforcement resolution reached (consent order executed or matter closed)',
          'Permanent controls implemented and tested per remediation plan',
          'Board compliance committee established with enhanced oversight structure',
        ],
        escalation: 'If consent order terms cannot be satisfied within the agreed timeline, CLO notifies regulator proactively and requests extension — failure to report noncompliance results in additional enforcement action.'
      },
      restrictions: [
        'All consent order compliance documentation must be certified by CCO and CLO — no self-certification without independent review.',
        'Financial penalties and enforcement history must be disclosed in regulatory capital calculations and SEC filings.',
      ]
    },
  ],

  // ── Service Level Agreement Mass Breach ───────────────────────────────────────
  '393db0c4-c22b-41f2-924f-acca9b224a4f': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm SLA breach scope; assess financial penalty exposure; activate customer success and legal response.',
      tasks: [
        { role: 'VP Operations / COO', items: [
          'Confirm breach: pull SLA metrics for all affected customers; document which specific SLA commitments were breached (uptime, response time, resolution time, throughput), breach duration, and affected customer count',
          'Classify breach: (a) single customer / isolated incident, (b) multi-customer / systemic failure, or (c) mass breach affecting 10%+ of customer base — classification determines response protocol',
          'Engage engineering to identify root cause: is this infrastructure failure, deployment error, third-party dependency failure, or capacity issue? Time to full remediation estimate?',
        ]},
        { role: 'General Counsel / VP Legal', items: [
          'Pull all affected customer SLA agreements: document each customer specific SLA thresholds, penalty structures (service credits, cash penalties, or termination rights), and cure periods',
          'Assess aggregate financial exposure: sum all contractual service credit obligations triggered by the breach; identify any customers with material breach termination rights triggered',
          'Identify any customers who have cure period notification requirements — some SLAs require written notice of breach before penalties are assessed',
        ]},
        { role: 'VP Customer Success', items: [
          'Triage customer impact: rank affected customers by (a) ARR, (b) breach severity, and (c) relationship health — this drives the outreach prioritization order',
          'Prepare customer-facing status page update and incident communication — Legal must approve content before publication',
        ]},
      ],
      decisionGate: {
        title: 'Is this breach systemic and does aggregate financial exposure require executive and board notification?',
        criteria: [
          'Breach affects 10+ enterprise customers or $500K+ in potential service credits',
          'One or more customers have a material breach / termination right triggered by the SLA failure',
          'Root cause is systemic (architectural, capacity, or vendor dependency) rather than isolated and immediately resolved',
        ],
        escalation: 'If 2+ criteria are met, COO notifies CEO and CFO within 2 hours; board is notified if total exposure exceeds materiality threshold established with CFO. VP Legal joins response team immediately.'
      },
      restrictions: [
        'Do not make any verbal commitments to customers about remedy, credits, or compensation before VP Legal has reviewed the contractual obligations — inconsistent commitments create liability.',
        'Status page and customer communications must not contain specific revenue or customer count information without CFO and Legal approval.',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Stabilize the service; execute tiered customer outreach; prepare financial exposure summary.',
      tasks: [
        { role: 'COO + VP Engineering', items: [
          'Remediate service failure: all-hands engineering response; 30-minute status cadence; do not release fix until fully validated — a second incident within 24 hours doubles customer retention risk',
          'Conduct post-restoration validation: confirm SLA metrics have recovered to normal operating levels across 100% of affected customers before closing the incident',
          'Begin root cause analysis: document full incident timeline for internal review and customer communication',
        ]},
        { role: 'VP Customer Success', items: [
          'Execute Tier 1 customer outreach (top 20 by ARR): VP or Director personal call within 6 hours of breach confirmation; acknowledge breach, confirm it is resolved, commit to full incident report within 48 hours',
          'Execute Tier 2 customer outreach (ARR $100K–$1M): Customer Success Manager call plus email within 12 hours',
          'Execute Tier 3 customer outreach (ARR below $100K): automated email with status update plus CSM follow-up within 24 hours',
        ]},
        { role: 'CFO + VP Legal', items: [
          'Finalize financial exposure calculation: total service credits owed per contract; cash penalty exposure; identify any customers where termination is a live risk',
          'Determine whether breach is material for financial statement or earnings disclosure purposes',
        ]},
      ],
      decisionGate: {
        title: 'Is the service restored and the top customer risk addressed?',
        criteria: [
          'All SLA metrics confirmed restored to contractual thresholds',
          'Top 20 customers by ARR contacted personally within 6 hours',
          'Aggregate financial exposure calculated and reviewed by CFO',
        ],
        escalation: 'If any top 5 customer (by ARR) issues a formal breach notice or signals intent to terminate, CLO and CEO engage directly within 24 hours on a retention negotiation.'
      },
      restrictions: [
        'Do not begin remediating SLA credits before VP Legal confirms contractual amounts — under-crediting triggers secondary dispute.',
        'No commitments to "never happen again" — commit instead to specific remediation actions and enhanced monitoring.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'Deliver incident reports; apply service credits; prevent churn; implement systemic fix.',
      tasks: [
        { role: 'VP Engineering + COO', items: [
          'Publish full incident post-mortem: timeline, root cause, contributing factors, immediate fix applied, and permanent remediation plan with timeline — Legal review required for external version',
          'Implement permanent fix: include infrastructure changes, monitoring enhancements, and capacity additions that prevent recurrence',
        ]},
        { role: 'VP Customer Success', items: [
          'Apply all contractual service credits proactively — do not wait for customer to invoice; proactive credit application is a significant retention signal',
          'Conduct retention risk assessment: call all customers who experienced significant breach impact and assess renewal intention; escalate any at-risk renewals to VP Sales or CEO',
          'Offer "SLA assurance" calls with customers who request it: VP Engineering explains the permanent fix and enhanced monitoring',
        ]},
        { role: 'VP Legal', items: [
          'Negotiate with any customers who have threatened termination: engage with specific retention offers (extended credits, contract re-terms, enhanced SLAs) within parameters pre-approved by CEO and CFO',
          'Document all customer communications regarding the breach for litigation defense',
        ]},
      ],
      decisionGate: {
        title: 'Are all contractual obligations met and customer churn risk contained?',
        criteria: [
          'All service credits applied to affected customer accounts',
          'Incident post-mortem delivered to all affected customers',
          'No active termination notices from customers representing 5%+ of ARR',
        ],
        escalation: 'If customers representing 5%+ ARR issue termination notices, CEO conducts personal outreach to each account within 24 hours; CFO approves exceptional retention packages on a case-by-case basis.'
      },
      restrictions: [
        'Exceptional retention packages (beyond standard service credits) require CFO and CEO approval.',
        'Legal settlements with terminating customers must be approved by CLO.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '30–90 days',
      objective: 'Rebuild customer trust; implement enhanced SLAs; conduct post-incident performance review.',
      tasks: [
        { role: 'COO + VP Engineering', items: [
          'Deploy enhanced monitoring and alerting: implement proactive SLA monitoring with 15-minute breach prediction alerts; test all monitoring systems within 30 days',
          'Publish 30-day reliability report to all affected customers: show SLA performance data for 30 days post-incident; demonstrate recovery and stability',
        ]},
        { role: 'VP Customer Success', items: [
          'NPS and CSAT re-survey all affected customers at 30 days: track recovery from pre-incident baseline',
          'Conduct quarterly business reviews with all Tier 1 customers within 45 days: include incident debrief, reliability data, and roadmap briefing to rebuild confidence',
        ]},
        { role: 'CEO + COO', items: [
          'Ninety-day post-incident executive review: total financial impact (credits, retention losses, and remediation cost), SLA performance recovery data, and systemic improvement plan',
          'Assess whether SLA commitments require renegotiation given infrastructure changes — more aggressive SLAs post-remediation are a competitive signal if infrastructure now supports them',
        ]},
      ],
      decisionGate: {
        title: 'Is customer trust restored and SLA performance consistently above threshold?',
        criteria: [
          'SLA compliance rate at 99.9%+ for 30 consecutive days post-remediation',
          'NPS recovery within 10 points of pre-incident baseline at 45-day survey',
          'No customer churn directly attributable to the SLA breach',
        ],
        escalation: 'If SLA performance drops below threshold again within 90 days, COO escalates to CEO for infrastructure investment decision and board is briefed on systemic reliability risk.'
      },
      restrictions: [
        'Post-incident financial impact data (credits, losses) is confidential — executive team and board only.',
        'Do not commit to enhanced SLA thresholds in customer communications without VP Engineering confirming infrastructure can support them.',
      ]
    },
  ],

  // ── Competitive Acquisition ────────────────────────────────────────────────────
  '756d8df1-dec3-4551-9309-ff75333270ae': [
    {
      id: 'phase-1', name: 'DETECT & VALIDATE', timeWindow: '0–4h',
      objective: 'Confirm acquisition announcement; assess strategic implications for your competitive position and key accounts.',
      tasks: [
        { role: 'Chief Strategy Officer', items: [
          'Confirm announcement: validate source (press release, SEC filing, Bloomberg/Reuters report) and deal terms (price paid, structure — stock/cash/earnout, assumed debt, and closing timeline)',
          'Map combined entity capabilities: list the top 10 capabilities of acquirer plus target combined; identify any that directly threaten your product differentiation or customer relationships',
          'Identify your customer overlap: which of your current customers were also customers of the acquired company? What products do they use from the acquired entity? How likely is cross-sell from the combined entity?',
          'Assess market reaction: pull analyst commentary, competitor stock movement, and social media sentiment within 4 hours of announcement — early signals of market perception',
        ]},
        { role: 'VP Sales', items: [
          'Identify pipeline deals where either acquirer or acquired company is a competitor or incumbent vendor — flag for immediate sales executive engagement',
          'Contact your top 10 sales reps: any conversations with customers about this deal in the last 24 hours? Any customers considering pausing decisions pending integration clarity?',
        ]},
      ],
      decisionGate: {
        title: 'Does this acquisition materially threaten your competitive position or key account relationships?',
        criteria: [
          'Combined entity now has a product suite that competes with 30%+ of your revenue base',
          'At least 5 of your top 50 accounts are also customers of the acquired company',
          'Acquisition gives competitor access to data, technology, or distribution that eliminates one of your stated competitive advantages',
        ],
        escalation: 'If 2+ criteria are met, CEO convenes War Room within 8 hours. If only 1 criterion, VP Sales drives tactical account response without executive War Room.'
      },
      restrictions: [
        'No public statements about the competitive acquisition without CEO and General Counsel approval.',
        'Do not approach acquired company employees about employment until acquisition closes — anti-poaching provisions in M&A agreements may apply.',
      ]
    },
    {
      id: 'phase-2', name: 'ASSEMBLE WAR ROOM', timeWindow: '4–24h',
      objective: 'Mobilize cross-functional response; develop competitive counter-narrative; protect at-risk accounts.',
      tasks: [
        { role: 'CEO + Chief Strategy Officer', items: [
          'Convene War Room: CEO, CPO, CMO, VP Sales, VP Customer Success, CFO, General Counsel — establish weekly cadence for 90-day competitive response',
          'Develop your counter-narrative: what does this acquisition NOT give them? Where are the integration risks (18–24 months of integration distraction, product roadmap freezes, employee uncertainty)?',
          'Assess whether this acquisition signals market validation of your space (positive) or a capability gap you need to close (negative) — both are possible and require different responses',
        ]},
        { role: 'CMO + VP Communications', items: [
          'Draft competitive talking points: what to say when customers ask about the acquisition; focus on your stability, roadmap continuity, and differentiation vs. the integration risk they now face',
          'Prepare competitive battlecard update: include acquisition implications, integration timeline risks, and 3 proof points where you now have a clear advantage during their integration period',
          'Brief analyst relations contacts: offer your perspective on market implications under NDA if appropriate',
        ]},
        { role: 'VP Customer Success', items: [
          'Execute at-risk account outreach: contact all accounts who are also customers of acquired company within 24 hours; executive-level call to understand their transition plan and any concerns',
          'Identify expansion opportunities in acquired company customer base who are unhappy with the acquisition — M&A uncertainty is a pipeline opportunity; coordinate with VP Sales on outbound approach',
        ]},
      ],
      decisionGate: {
        title: 'Is your competitive response strategy locked and account protection underway?',
        criteria: [
          'Competitive counter-narrative approved by CEO, CMO, and Legal',
          'At-risk accounts contacted within 24 hours',
          'Battlecard distributed to sales team with training session scheduled',
        ],
        escalation: 'If a top 5 account (by ARR) announces a strategic review of their vendor relationship post-acquisition, CEO engages personally within 24 hours.'
      },
      restrictions: [
        'All competitive messaging about the acquisition must be factual and Legal-approved — do not make false or misleading claims.',
        'Customer outreach must focus on your existing relationships and their continuity — not characterize it as poaching.',
      ]
    },
    {
      id: 'phase-3', name: 'STRATEGY LOCK', timeWindow: '24–72h',
      objective: 'Finalize competitive investment decisions; execute account win-back program; consider whether counter-M&A is warranted.',
      tasks: [
        { role: 'CEO + CFO + Chief Strategy Officer', items: [
          'Evaluate counter-M&A options: does this acquisition signal that inorganic growth is necessary to maintain competitive position? Identify top 3 potential acquisition or partnership targets in the next 90 days',
          'Assess whether accelerated product investment is warranted: what roadmap items would most directly address the competitive gap created by the combined entity? Fund and accelerate the top 2.',
          'Model 3-year competitive scenario: if acquisition closes and integration succeeds, what is your market position relative to combined entity? What is the path to maintaining market share?',
        ]},
        { role: 'VP Sales', items: [
          'Launch "integration uncertainty" pipeline play: targeted outbound to acquired company customers with message focused on continuity, commitment, and no-integration-risk positioning; set 90-day pipeline target',
          'Update sales quota and incentive structure: offer enhanced SPIFs for deals won against the combined entity for first 90 days post-acquisition close',
        ]},
      ],
      decisionGate: {
        title: 'Is the competitive response strategy funded and the integration-period opportunity playbook active?',
        criteria: [
          'Accelerated roadmap items funded and communicated to engineering',
          'Counter-M&A or partnership evaluation formally underway (or formally deferred with rationale)',
          '90-day integration-period sales pipeline target set and tracked',
        ],
        escalation: 'If acquisition closes with no integration delays and combined entity begins winning deals immediately, CEO escalates investment decision to board for emergency funding authorization.'
      },
      restrictions: [
        'Counter-M&A conversations require board authorization and NDA before any substantive discussions.',
        'Integration-period messaging must focus on your own commitments, not competitor integration problems.',
      ]
    },
    {
      id: 'phase-4', name: 'EXECUTE & DOCUMENT', timeWindow: '30–180 days',
      objective: 'Monitor competitive impact; track integration progress; update strategy as integration reality becomes clear.',
      tasks: [
        { role: 'Chief Strategy Officer', items: [
          'Monthly competitive intelligence report: track combined entity integration progress, product announcements, customer testimonials, and sales activity',
          'Update competitive response strategy at 60 and 90 days based on actual integration execution — most integrations reveal execution gaps that create competitive windows',
        ]},
        { role: 'VP Sales', items: [
          'Track win/loss data specifically against combined entity for 90 days: what objections are arising, what is the win rate trend, and which proof points are landing most effectively with customers',
          'Ninety-day pipeline report: how many deals closed from the "integration uncertainty" pipeline play; what was the revenue outcome?',
        ]},
        { role: 'CEO', items: [
          'Ninety-day executive review: assess whether initial threat assessment was accurate; determine if counter-M&A remains warranted; update board on competitive position',
        ]},
      ],
      decisionGate: {
        title: '90-day review: Is competitive position stable or deteriorating?',
        criteria: [
          'Win rate against combined entity maintained within 5% of pre-acquisition baseline',
          'No top 5 account lost to combined entity within first 90 days',
          'Accelerated roadmap on track',
        ],
        escalation: 'If win rate drops 10%+ against combined entity in 90 days, CEO convenes board for strategic options review including potential partnership or M&A acceleration.'
      },
      restrictions: [
        'Competitive intelligence gathering must use only legal sources — no unauthorized access to competitor systems, customer lists, or internal documents.',
      ]
    },
  ],

  // ── AI Data Privacy Breach ────────────────────────────────────────────────────
  'd1a652ae-294d-4dbc-9007-da810ba8e074': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm unauthorized access, use, or disclosure of data processed by AI systems; classify AI-specific regulatory exposure.',
      tasks: [
        { role: 'CISO + Chief AI Officer / CTO', items: [
          'Confirm breach scope: identify which AI systems were involved (training pipelines, inference APIs, model weights, feature stores, or output logs); characterize data type (PII, biometric, behavioral, financial, health, or protected class data)',
          'Assess AI-specific risks: determine whether breach exposed training data (revealing personal information used to train models), model outputs (predictions that constitute personal data under GDPR Article 4), or model weights (IP and privacy risk)',
          'Preserve forensic evidence: snapshot all AI system logs, model versions, training data manifests, and API access logs in write-once storage; do not modify models or retrain during investigation',
        ]},
        { role: 'Chief Privacy Officer / General Counsel', items: [
          'Assess AI-specific regulatory obligations: GDPR Article 22 (automated decision-making), CCPA/CPRA AI transparency requirements, EEOC guidelines if AI was used in employment decisions, and sector-specific AI regulations',
          'Identify whether breach triggers "high risk" DPIA requirements under GDPR Article 35 — AI systems processing personal data at scale typically require DPIA',
          'Engage specialized AI/privacy outside counsel within 2 hours',
        ]},
        { role: 'CEO', items: [
          'Notify board within 2 hours; convene incident response team including Chief AI Officer, CISO, CPO/Privacy Officer, and General Counsel',
          'Assess public communication risk: AI privacy breaches generate significant media attention — determine whether proactive press strategy is warranted vs. reactive',
        ]},
      ],
      decisionGate: {
        title: 'Is this breach material and does it require GDPR supervisory authority notification or other regulatory filing?',
        criteria: [
          'Breach involved personal data processed by AI systems affecting 500+ individuals',
          'AI system processed sensitive data categories (health, biometric, financial, or behavioral profiling data)',
          'AI outputs or recommendations were used in consequential decisions (employment, credit, insurance, or healthcare) without required human review',
        ],
        escalation: 'If 2+ criteria are met, CPO notifies GDPR supervisory authority within 72 hours. CEO brief to board within 4 hours.'
      },
      restrictions: [
        'Do not retrain or modify affected AI models until forensic review is complete — retraining destroys evidence.',
        'No public statements about AI breach without Legal and Chief AI Officer review.',
        'All AI audit logs and model documentation are privileged during investigation.',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Complete AI system forensics; prepare regulatory response; assess bias or discrimination claims arising from breach.',
      tasks: [
        { role: 'Chief AI Officer + CISO', items: [
          'Conduct AI system audit: document all data flows into and out of affected AI systems; identify what personal data was used in training, what inferences were made, and whether inferences were stored or shared',
          'Assess model integrity: confirm whether model weights were accessed or exfiltrated; if so, assess risk of model inversion attacks (ability to reconstruct training data from model weights)',
          'Suspend affected AI systems or deploy degraded mode if breach poses ongoing risk to individuals — document decision and rationale',
        ]},
        { role: 'Chief Privacy Officer', items: [
          'Conduct data subject impact assessment: for individuals whose data was involved, what harm could result? Consider: discrimination risk from exposed predictions, identity theft from exposed training data, reputational harm from exposed behavioral data',
          'Prepare GDPR Article 34 individual notification assessment: is notification to affected individuals required because breach is likely to result in high risk to their rights and freedoms?',
        ]},
        { role: 'General Counsel', items: [
          'Assess discrimination and bias claims exposure: if AI system was used in employment, lending, insurance, or housing decisions and breach exposed protected class data, assess EEOC, CFPB, or HUD exposure',
          'Prepare regulatory notification strategy: GDPR supervisory authority, FTC (if unfair/deceptive AI practices), CFPB (if financial AI), EEOC (if employment AI), and state AI regulators',
        ]},
      ],
      decisionGate: {
        title: 'Authorize regulatory notifications and determine whether affected AI systems should be suspended',
        criteria: [
          'AI forensic report characterizes scope and individual harm risk with sufficient certainty',
          'Regulatory notification matrix approved by outside counsel',
          'Decision on AI system suspension or continued operation made by Chief AI Officer and CEO with documented risk rationale',
        ],
        escalation: 'If AI system breach reveals systematic bias or discrimination in AI decision-making, CLO notifies CEO and board immediately — this is a separate enforcement risk from the privacy breach.'
      },
      restrictions: [
        'Do not make public statements minimizing the breach or claiming "no harm" until independent forensic review is complete.',
        'Suspension of AI systems affects business operations — coordinate with operations before suspension.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'File regulatory notifications; notify affected individuals; remediate AI systems with enhanced privacy controls.',
      tasks: [
        { role: 'Chief Privacy Officer + Outside Counsel', items: [
          'File GDPR supervisory authority notification with known facts; schedule follow-up filing within 30 days with complete investigation findings',
          'Notify affected individuals if individual notification required: explain in plain language what data was involved, how the AI system used it, what decisions were made, and what rights they have',
          'File notifications with applicable sector regulators',
        ]},
        { role: 'Chief AI Officer', items: [
          'Remediate affected AI systems: implement privacy-by-design controls (differential privacy, data minimization, access controls); retrain models with cleaner data if training data was compromised',
          'Deploy enhanced AI monitoring: log all AI decisions with confidence scores, flag decisions affecting sensitive protected classes, implement mandatory human review for high-impact AI decisions',
        ]},
        { role: 'CMO + CEO', items: [
          'Publish AI transparency statement: explain how AI is used in your products, what data it processes, what protections are in place, and what the breach response included — this is a trust-rebuilding signal',
        ]},
      ],
      decisionGate: {
        title: 'Are affected individuals notified and AI systems remediated with enhanced privacy controls?',
        criteria: [
          'All required regulatory notifications filed',
          'Affected individuals notified where legally required',
          'Remediated AI systems deployed with enhanced privacy controls and independent review',
        ],
        escalation: 'If regulatory enforcement action is initiated (FTC investigation, GDPR enforcement proceeding), CLO activates litigation response team with outside counsel specializing in AI regulatory enforcement.'
      },
      restrictions: [
        'Individual notifications for AI breaches must explain AI decision-making in plain language — jargon-heavy technical explanations increase regulatory risk.',
        'Do not restart suspended AI systems without Chief AI Officer and CPO sign-off on remediated controls.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '30–180 days',
      objective: 'Resolve regulatory proceedings; rebuild AI governance program; publish transparency report.',
      tasks: [
        { role: 'Chief AI Officer + Chief Privacy Officer', items: [
          'Deploy comprehensive AI governance framework: AI risk assessment process for new models, mandatory privacy impact assessments for AI systems, quarterly AI audit program, and board AI risk committee',
          'Publish AI Transparency Report within 90 days: types of AI used, data processed, decisions made, bias testing results, and privacy controls',
        ]},
        { role: 'General Counsel', items: [
          'Resolve regulatory proceedings: cooperate with all investigations; negotiate settlement terms that include enhanced AI governance commitments and monitoring period',
          'Monitor AI regulatory landscape: emerging AI-specific regulations require ongoing compliance posture updates',
        ]},
        { role: 'CEO + Board', items: [
          'Ninety-day board debrief: total cost, regulatory outcome, AI governance improvements, and AI investment strategy going forward',
          'Consider whether Chief AI Officer role requires elevation to board reporting or board-level AI committee',
        ]},
      ],
      decisionGate: {
        title: 'Is AI governance rebuilt and regulatory matters resolved?',
        criteria: [
          'AI governance framework deployed and first quarterly audit complete',
          'AI Transparency Report published',
          'Regulatory matters resolved with documented compliance program improvements',
        ],
        escalation: 'If EU AI Act or state AI regulation imposes new obligations before remediation is complete, Chief AI Officer and CPO assess compliance gap and brief CEO within 30 days.'
      },
      restrictions: [
        'AI Transparency Report must be reviewed by Legal before publication — admissions about past AI practices can be used in litigation.',
        'AI governance framework must be independently audited before public claims of "privacy-by-design" are made in marketing materials.',
      ]
    },
  ],

  // ── Third-Party Data Breach (Vendor) ──────────────────────────────────────────
  '99c75185-28c4-47bb-89dc-7a59df9f5e08': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm vendor breach scope; assess your organization\'s data exposure; activate vendor contract rights.',
      tasks: [
        { role: 'CISO', items: [
          'Confirm breach: obtain written notification from vendor (or vendor\'s counsel) confirming breach event; document notification receipt timestamp for regulatory clock purposes',
          'Assess your data exposure: identify all data you shared with the vendor, the volume of records, data types (PII, PHI, financial data), and the specific systems or environments affected',
          'Request immediate access to vendor\'s forensic investigation: your data is involved — you have a right to information under most DPA/MSA agreements; engage your own forensic firm if vendor access is delayed',
        ]},
        { role: 'General Counsel', items: [
          'Pull all vendor contracts: master services agreement, data processing agreement (DPA), security addendum, and SLA; identify your contractual rights including notification obligations, indemnification rights, audit rights, and termination triggers',
          'Begin regulatory clock analysis: your organization may owe notification to regulators and affected individuals even though the breach occurred at a vendor',
          'Engage outside privacy counsel within 2 hours; issue litigation hold on all vendor communications',
        ]},
        { role: 'CEO + CFO', items: [
          'Notify board within 2 hours; assess cyber insurance coverage for third-party breaches',
          'Assess reputational risk: vendors with poor breach response practices reflect on your security posture — prepare to distance your security program from the vendor\'s failure if warranted',
        ]},
      ],
      decisionGate: {
        title: 'Does your data exposure trigger regulatory notification obligations and customer notification?',
        criteria: [
          'Vendor breach confirmed to have included your customer or employee personal data',
          'Data involved is subject to specific notification obligations (GDPR, CCPA, HIPAA, state breach notification laws)',
          'Vendor has not committed to a regulatory notification timeline that satisfies your compliance obligations',
        ],
        escalation: 'If vendor breach notification was delayed beyond contractual or regulatory requirements, General Counsel assesses breach of contract claim and regulatory reporting of notification delay. CEO notified within 2 hours.'
      },
      restrictions: [
        'Do not assume the vendor\'s notification to regulators satisfies your independent obligations — most privacy laws require the data controller (you) to notify, not just the processor (vendor).',
        'Do not make public statements blaming the vendor until legal rights and contractual claims are assessed.',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Complete exposure assessment; prepare regulatory response; assess vendor liability and relationship continuity.',
      tasks: [
        { role: 'CISO', items: [
          'Complete data exposure inventory: exact record count, data types, and customer and employee breakdown from vendor breach scope report; engage your own forensic firm if vendor report is incomplete or delayed',
          'Assess technical controls: did your data-sharing practices with the vendor follow your security requirements? Were encryption, access controls, and data minimization obligations met? This affects both regulatory response and indemnification claims.',
          'Review all other vendor access to your data: audit all third-party data processors in light of this breach; identify any who may have similar security gaps',
        ]},
        { role: 'General Counsel + Outside Counsel', items: [
          'File regulatory notifications per your organization\'s independent obligations — do not wait for vendor to file; coordinate timing with outside counsel to ensure your filing is complete and accurate',
          'Assess indemnification claim against vendor: document all costs (forensics, legal, notification, monitoring, regulatory) for recovery under vendor contract',
          'Determine whether to terminate vendor relationship immediately or during transition — termination triggers may have been met; weigh operational continuity vs. ongoing security risk',
        ]},
        { role: 'VP Customer Success', items: [
          'Prepare customer notification: customers whose data was held by the vendor must be notified; draft notification letter with General Counsel; personal outreach to top enterprise accounts before mass notification',
        ]},
      ],
      decisionGate: {
        title: 'Are regulatory notifications filed and vendor liability assessed?',
        criteria: [
          'All required regulatory notifications filed based on your organization\'s independent data controller obligations',
          'Indemnification claim documented and demand letter timeline established with outside counsel',
          'Vendor termination decision made with transition plan if termination is elected',
        ],
        escalation: 'If vendor refuses to provide forensic report, denies your data was involved, or delays notification beyond contractual timeline, General Counsel initiates breach of contract action within 48 hours.'
      },
      restrictions: [
        'Your regulatory notification must be based on your independent assessment of data exposure — do not rely solely on vendor characterization of the breach scope.',
        'All communications with the vendor are potentially discoverable — route through outside counsel to maintain privilege.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'Notify customers; implement vendor security remediation requirements; assess third-party vendor portfolio risk.',
      tasks: [
        { role: 'CISO + Procurement', items: [
          'Require vendor remediation plan: under your data processing agreement, demand a written remediation plan from vendor within 48 hours; conduct independent security audit of vendor environment per your contractual audit rights',
          'Conduct emergency vendor security review: extend review to all Tier 1 data processors with access to sensitive personal data; issue security questionnaire and request updated SOC 2 reports',
        ]},
        { role: 'VP Customer Success + General Counsel', items: [
          'Execute customer notification program: send approved letters to all affected individuals; offer credit monitoring through independent provider (not vendor who was breached)',
          'Brief enterprise customers personally before mass notification; prepare dedicated support channel for breach inquiries',
        ]},
        { role: 'CFO', items: [
          'File insurance claim for third-party breach costs: document all costs for recovery under cyber liability policy; confirm policy covers third-party vendor breaches',
          'Pursue indemnification from vendor: issue formal demand letter per contract; establish recovery timeline and escalation path if vendor disputes claim',
        ]},
      ],
      decisionGate: {
        title: 'Are customers notified and vendor remediation underway?',
        criteria: [
          'Customer notification complete or actively underway',
          'Vendor remediation plan received and accepted or breach of contract claim filed',
          'Independent vendor security audit scheduled',
        ],
        escalation: 'If vendor disputes indemnification claim or goes into insolvency, General Counsel escalates to litigation counsel and assesses alternative recovery options.'
      },
      restrictions: [
        'Do not accept vendor\'s self-assessment of remediation completion — require independent audit results.',
        'Credit monitoring must be provided through a provider independent of the breached vendor.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '30–90 days',
      objective: 'Resolve vendor liability; overhaul third-party risk management program; rebuild customer trust.',
      tasks: [
        { role: 'CISO + Procurement', items: [
          'Implement Third-Party Risk Management (TPRM) overhaul: require SOC 2 Type II for all Tier 1 vendors, annual vendor security assessments, and contractual right-to-audit in all new DPAs',
          'Implement data minimization with vendors: audit all data shared with third parties; eliminate sharing of personal data that is not contractually required; implement field-level encryption for all sensitive data shared externally',
        ]},
        { role: 'General Counsel', items: [
          'Recover indemnification costs from vendor: escalate to litigation if vendor disputes or delays; assess recovery timeline and litigation economics',
          'Update standard vendor contracts: enhance security requirements, notification obligations (24-hour notification requirement), audit rights, and indemnification scope in all new and renewing vendor agreements',
        ]},
        { role: 'CEO + Board', items: [
          'Ninety-day board report: total breach cost, vendor recovery amount, TPRM overhaul status, and supply chain security investment plan',
          'Publish vendor security standards externally if competitive advantage — signals supply chain security leadership to enterprise customers',
        ]},
      ],
      decisionGate: {
        title: 'Is vendor relationship resolved and TPRM program materially improved?',
        criteria: [
          'Indemnification recovery complete or litigation path determined',
          'All Tier 1 vendors re-assessed with enhanced requirements',
          'New TPRM standards deployed for all future vendor agreements',
        ],
        escalation: 'If a second third-party breach occurs within 12 months, board conducts immediate review of CISO and vendor management program — systemic TPRM failure requires executive accountability.'
      },
      restrictions: [
        'TPRM improvements must be independently verified — internal self-assessments cannot be represented as third-party validated.',
      ]
    },
  ],

  // ── Compound: Cyber + Regulatory Cascade ─────────────────────────────────────
  '2d990832-29e0-4d06-99f8-c3d630847d08': [
    {
      id: 'phase-1', name: 'BREACH CONFIRMATION', timeWindow: '0–4h',
      objective: 'Confirm cyber event; identify simultaneous or imminent regulatory trigger; prioritize response resources across both tracks.',
      tasks: [
        { role: 'CISO + General Counsel', items: [
          'Confirm cyber event: identify attack type (ransomware, data exfiltration, supply chain compromise, or DDoS), affected systems, and operational impact',
          'Identify regulatory cascade risk: does the cyber event trigger simultaneous regulatory obligations? Check: SEC 4-day material incident disclosure, OCC/FDIC 36-hour bank regulator notification, HIPAA 60-day notification, GDPR 72-hour notification, and any state-specific requirements',
          'Assess operational vs. regulatory priority: is the regulatory notification clock more urgent than cyber remediation? Often yes — run both tracks simultaneously with dedicated leads',
        ]},
        { role: 'CEO', items: [
          'Declare compound crisis: activate full executive team; assign Incident Commander (CISO) for cyber track and Compliance Commander (CLO) for regulatory track with daily convergence briefing to CEO',
          'Notify board within 2 hours: brief on cyber event scope, operational impact, and regulatory notification timeline',
          'Assess whether cyber event and regulatory cascade create disclosure obligations in combination that neither would trigger alone',
        ]},
        { role: 'CFO', items: [
          'Activate cyber insurance: compound events often have complex coverage interactions; engage carrier and coverage counsel within 4 hours to assess which costs are covered under which policies',
          'Assess financial materiality: combined financial impact of cyber response plus regulatory penalties may require SEC disclosure even if neither alone would be material',
        ]},
      ],
      decisionGate: {
        title: 'Are both cyber and regulatory response tracks confirmed and resourced?',
        criteria: [
          'Cyber Incident Commander designated with authority to execute technical response',
          'Regulatory Compliance Commander designated with outside counsel engaged on regulatory track',
          'CEO and board briefed on dual-track nature of response and resource requirements',
        ],
        escalation: 'Compound crises require immediate CEO engagement — this playbook cannot be delegated below CEO level given dual regulatory and operational exposure.'
      },
      restrictions: [
        'Do not allow cyber response priorities to crowd out regulatory notification obligations — missed regulatory deadlines compound the crisis.',
        'All communications on both tracks must be coordinated through outside counsel to maintain privilege.',
        'Do not negotiate cyber ransom without FBI/CISA consultation and board authorization.',
      ]
    },
    {
      id: 'phase-2', name: 'WAR ROOM ASSEMBLY', timeWindow: '4–24h',
      objective: 'Operate dual response tracks simultaneously; complete scope assessment; file first regulatory notifications.',
      tasks: [
        { role: 'CISO (Cyber Track)', items: [
          'Contain cyber threat: isolate affected systems; preserve forensic evidence; engage forensic firm; identify and close attack vector',
          'Assess data exfiltration: was personal data or confidential information exfiltrated? Scope and data type drive regulatory notification obligations on the compliance track',
          'Produce hourly cyber status reports for convergence briefing with CEO',
        ]},
        { role: 'CLO (Regulatory Track)', items: [
          'File preliminary notifications where required: GDPR supervisory authority (if 72-hour clock running), OCC/FDIC (36-hour if bank), SEC (4-day if material) — preliminary filing preserves compliance even if scope is incomplete',
          'Assess whether multiple regulators need coordinated notification: compound events can trigger 4+ regulatory notification obligations simultaneously; use jurisdiction matrix to track all deadlines',
          'Monitor for regulatory escalation: designate regulatory inquiry point of contact; ensure no ad-hoc regulator interactions',
        ]},
        { role: 'CFO', items: [
          'Assess aggregate financial exposure: cyber remediation cost plus regulatory penalties plus litigation exposure; provide CEO with preliminary range within 12 hours for board briefing',
          'Engage forensic accountants if ransomware or financial system impact — business interruption quantification required for insurance claim',
        ]},
      ],
      decisionGate: {
        title: 'Are preliminary regulatory notifications filed and cyber containment underway?',
        criteria: [
          'All regulatory notification deadlines tracked; preliminary filings made where clock is running',
          'Cyber containment confirmed by CISO (or containment in progress with timeline)',
          'Board has authorized resources for both response tracks',
        ],
        escalation: 'If cyber event affects critical infrastructure, financial system integrity, or national security systems, notify CISA and FBI immediately — failure to engage can be interpreted as non-cooperation.'
      },
      restrictions: [
        'Do not attempt to negotiate with regulators on notification timing without outside counsel involvement.',
        'Cyber containment actions must not destroy evidence needed for regulatory response — coordinate between CISO and CLO before any system wipe or restoration.',
      ]
    },
    {
      id: 'phase-3', name: 'CONTAINMENT & FORENSICS', timeWindow: '24–72h',
      objective: 'Complete cyber remediation and regulatory notifications; manage media and customer communications; begin convergence of dual tracks.',
      tasks: [
        { role: 'CISO', items: [
          'Complete cyber remediation: all attack vectors closed, forensic investigation complete, systems restored from clean backups, and recurrence validated against',
          'Produce final forensic report: required for regulatory submissions, insurance claims, and customer communications',
        ]},
        { role: 'CLO + Outside Counsel', items: [
          'File complete regulatory notifications using forensic report: replace preliminary filings with full submissions where required',
          'Coordinate regulatory responses across all applicable jurisdictions: ensure consistent factual narrative across all regulatory filings — inconsistencies are scrutinized in enforcement proceedings',
          'Assess whether compound event constitutes "pattern" or "systemic failure" under any regulatory framework — compound events often attract heightened regulatory attention',
        ]},
        { role: 'CMO + CEO', items: [
          'Execute coordinated external communication: customer notification, press statement, and status update page — compound crises require single, consistent narrative across all channels',
          'Offer affected customers: credit monitoring, dedicated support line, and personal briefing from VP or CEO for enterprise accounts',
        ]},
      ],
      decisionGate: {
        title: 'Is the cyber event contained and all regulatory notifications complete?',
        criteria: [
          'CISO confirms cyber remediation complete with independent verification',
          'All regulatory notifications filed with complete forensic information',
          'Customer notification complete or underway',
        ],
        escalation: 'If regulatory enforcement action is initiated before cyber remediation is complete, CLO and CEO determine whether to request regulatory accommodation of timeline given operational response requirements.'
      },
      restrictions: [
        'The external narrative across regulatory filings, customer communications, and press must be factually consistent — discrepancies between regulatory filings and public statements are a significant enforcement risk.',
      ]
    },
    {
      id: 'phase-4', name: 'NOTIFICATION & RECOVERY', timeWindow: '30–180 days',
      objective: 'Resolve regulatory proceedings; rebuild security and compliance infrastructure; implement compound risk prevention.',
      tasks: [
        { role: 'CISO', items: [
          'Deploy comprehensive security remediation: address all forensic findings; implement enhanced detection and response capabilities; conduct third-party penetration test within 60 days to validate remediation',
          'Implement cyber-regulatory integration: ensure future cyber incidents automatically trigger regulatory notification review within 1 hour — the compliance clock is unforgiving in compound events',
        ]},
        { role: 'CLO', items: [
          'Negotiate regulatory resolution across all jurisdictions: coordinate between regulators to avoid double-counting in penalty negotiations; leverage cooperation credit from voluntary disclosure and remediation speed',
          'Monitor all consent order obligations from all regulators — maintain compliance calendar with each regulator\'s reporting deadlines',
        ]},
        { role: 'CEO + Board', items: [
          'Compound crisis post-mortem: total financial impact across both tracks, regulatory relationships assessment, security and compliance investment plan for next 24 months',
          'Assess whether CISO and CCO reporting structures require elevation — compound events often reveal gaps in C-suite coordination',
          'Publish enhanced transparency report within 90 days: security improvements, compliance program enhancements, and lessons learned',
        ]},
      ],
      decisionGate: {
        title: 'Are both regulatory proceedings resolved and compound risk prevention embedded?',
        criteria: [
          'All regulatory enforcement actions resolved with executed consent orders or closed matters',
          'Integrated cyber-regulatory response protocol implemented and tested',
          'Board approved 24-month security and compliance investment plan',
        ],
        escalation: 'If a third regulatory jurisdiction opens an enforcement action more than 90 days after the initial compound event, CLO assesses whether broader regulatory pattern risk requires proactive engagement with remaining regulators.'
      },
      restrictions: [
        'Regulatory resolution terms across jurisdictions must be coordinated to ensure no conflicting obligations are accepted.',
        'Transparency report must be reviewed by all applicable regulatory counsel before publication.',
      ]
    },
  ],

};

async function main() {
  const entries = Object.entries(PLAYBOOK_PHASES);
  console.log(`Updating ${entries.length} playbooks...`);
  
  for (const [id, phases] of entries) {
    const json = JSON.stringify(phases);
    await pool.query(
      `UPDATE playbook_library SET enriched_phases = $1::jsonb, updated_at = NOW() WHERE id = $2`,
      [json, id]
    );
    console.log(`✓ Updated: ${id}`);
  }
  
  // Verify
  const verify = await pool.query(
    `SELECT id, name, 
       jsonb_array_length(enriched_phases) as phases,
       jsonb_array_length(enriched_phases->0->'tasks') as phase1_roles
     FROM playbook_library 
     WHERE id = ANY($1::uuid[])
     ORDER BY name`,
    [entries.map(([id]) => id)]
  );
  
  console.log('\nVerification:');
  verify.rows.forEach(r => {
    const taskCount = r.phase1_roles;
    console.log(`  ${r.name}: ${r.phases} phases, ${taskCount} role-groups in phase 1`);
  });
  
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
