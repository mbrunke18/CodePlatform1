/**
 * Playbook Templates Seed - Detailed examples for Playbook #004
 * Demonstrates the 80/20 Template Framework in action
 */

import { db } from '../db';
import {
  playbookLibrary,
  playbookDecisionTrees,
  playbookCommunicationTemplates,
  playbookTaskSequences,
} from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedPlaybookTemplates() {
  console.log('📋 Seeding Playbook Templates (80/20 Framework)...');

  // Get Playbook #004 (Competitor Product Launch - Breakthrough Innovation)
  const playbook004 = await db.query.playbookLibrary.findFirst({
    where: eq(playbookLibrary.playbookNumber, 4),
  });

  if (!playbook004) {
    console.log('⚠️  Playbook #004 not found, skipping template seed');
    return;
  }

  // SECTION 3: Decision Trees (85% Pre-filled)
  console.log('├─ Creating Decision Trees...');
  const decisionTrees = [
    {
      playbookId: playbook004.id,
      checkpointNumber: 1,
      checkpointName: 'Severity Assessment',
      checkpointTiming: 'T+3:00',
      sequence: 1,
      decisionQuestion: 'Is this breakthrough threat real or marketing hype?',
      decisionAuthority: 'CEO + CTO',
      decisionCriteria: {
        factors: [
          'Technology gap assessment',
          'Media coverage volume and sentiment',
          'Customer inquiry spike',
          'Analyst reaction',
        ],
        thresholds: {
          technologyGap: { value: 6, unit: 'months', severity: 'critical' },
          mediaArticles: { value: 1000, unit: 'articles/24h', severity: 'high' },
          customerInquiries: { value: 50, unit: 'percent_increase', severity: 'medium' },
          analystSentiment: { value: 70, unit: 'percent_positive', severity: 'high' },
        },
      },
      decisionOptions: [
        {
          name: 'REAL THREAT',
          description: 'Technology assessment confirms significant gap. Proceed to full response.',
          decisionAuthority: 'CEO + CTO',
          nextCheckpoint: 'Response Strategy',
          estimatedCost: 0,
          estimatedTime: 90, // minutes
        },
        {
          name: 'MARKETING HYPE',
          description: 'Technology claims unsubstantiated. Monitor situation.',
          decisionAuthority: 'CTO',
          nextCheckpoint: null,
          estimatedCost: 0,
          estimatedTime: 30,
        },
      ],
    },
    {
      playbookId: playbook004.id,
      checkpointNumber: 2,
      checkpointName: 'Response Strategy',
      checkpointTiming: 'T+4:30',
      sequence: 2,
      decisionQuestion: 'Which strategic response approach should we execute?',
      decisionAuthority: 'CEO',
      decisionCriteria: {
        factors: [
          'Time to market impact',
          'Financial investment required',
          'Customer retention probability',
          'Competitive positioning outcome',
          'Execution risk',
        ],
      },
      decisionOptions: [
        {
          name: 'OPTION A: ACCELERATE ROADMAP',
          description: 'Crash program to deliver comparable features in 3 months',
          decisionAuthority: 'CEO + CFO',
          budget: 8000000,
          timeline: '3 months',
          risks: ['Quality compromise', 'Customer promises we might miss'],
          message: 'Coming soon, even better',
          nextCheckpoint: 'Budget Approval',
        },
        {
          name: 'OPTION B: DIFFERENTIATE & DEFEND',
          description: 'Double down on unique strengths (security, customization)',
          decisionAuthority: 'CEO',
          budget: 3000000,
          timeline: 'Immediate',
          risks: ['May not address feature gap', 'Customer perception of weakness'],
          message: 'Different approach, better for enterprise',
          nextCheckpoint: null,
        },
        {
          name: 'OPTION C: ACQUIRE CAPABILITIES',
          description: 'Identify acquisition targets with comparable technology',
          decisionAuthority: 'CEO + Board',
          budget: 100000000,
          timeline: '60-90 days',
          risks: ['Integration complexity', 'Regulatory approval delays'],
          message: 'Expanding capabilities through partnership',
          nextCheckpoint: 'Board Approval',
        },
      ],
    },
  ];

  await db.insert(playbookDecisionTrees).values(decisionTrees);

  // SECTION 4: Communication Templates (80% Pre-filled)
  console.log('├─ Creating Communication Templates...');
  const communicationTemplates = [
    {
      playbookId: playbook004.id,
      templateName: 'Media Statement',
      templateType: 'media_statement',
      subject: '[COMPANY_NAME] Statement on [COMPETITOR_NAME] Announcement',
      sendTiming: 'T+8:00',
      isRequired: true,
      variables: ['COMPANY_NAME', 'COMPETITOR_NAME', 'PRODUCT_TECHNOLOGY', 'KEY_DIFFERENTIATOR_1', 'KEY_DIFFERENTIATOR_2', 'KEY_DIFFERENTIATOR_3', 'CEO_NAME', 'CEO_QUOTE'],
      recipientRoles: ['Press', 'Media', 'Analysts'],
      bodyTemplate: `FOR IMMEDIATE RELEASE

[COMPANY_NAME] Statement on [COMPETITOR_NAME] Announcement

[CITY, STATE] - [DATE] - [COMPANY_NAME] acknowledges [COMPETITOR_NAME]'s announcement of [PRODUCT_TECHNOLOGY]. We welcome innovation that advances the industry.

[COMPANY_NAME] remains focused on delivering [UNIQUE_VALUE_PROPOSITION]. Our enterprise customers choose us for [KEY_DIFFERENTIATOR_1], [KEY_DIFFERENTIATOR_2], and [KEY_DIFFERENTIATOR_3].

"[CEO_QUOTE]" - [CEO_NAME], CEO of [COMPANY_NAME]

[COMPANY_NAME] will continue to invest in [TECHNOLOGY_AREA] and remains committed to [MISSION_STATEMENT].

For more information: [CONTACT]`,
    },
    {
      playbookId: playbook004.id,
      templateName: 'Customer Email (CEO to Enterprise)',
      templateType: 'customer_email',
      subject: '[COMPETITOR_NAME] Announcement - What It Means for You',
      sendTiming: 'T+8:00',
      isRequired: true,
      variables: ['CUSTOMER_NAME', 'COMPETITOR_NAME', 'PRODUCT_TECHNOLOGY', 'VALUE_METRIC', 'CUSTOMER_SUCCESS_METRIC', 'UPCOMING_FEATURE_1', 'UPCOMING_FEATURE_2', 'UPCOMING_FEATURE_3', 'CEO_EMAIL', 'CEO_PHONE'],
      recipientRoles: ['Enterprise Customers', 'Account Executives'],
      bodyTemplate: `Dear [CUSTOMER_NAME],

By now you may have seen [COMPETITOR_NAME]'s announcement about [PRODUCT_TECHNOLOGY]. I wanted to reach out personally to address any questions you might have.

Here's what you need to know:

1. YOUR INVESTMENT IS PROTECTED
   Your [COMPANY_PRODUCT] deployment continues to deliver [VALUE_METRIC]. We remain committed to [CUSTOMER_SUCCESS_METRIC].

2. WE'RE INNOVATING TOO
   Our roadmap includes [UPCOMING_FEATURE_1], [UPCOMING_FEATURE_2], and [UPCOMING_FEATURE_3] - all designed specifically for enterprise needs like yours.

3. WHAT MAKES US DIFFERENT
   [COMPETITOR_NAME] focuses on [THEIR_STRENGTH]. We focus on [OUR_STRENGTH_1], [OUR_STRENGTH_2], and [OUR_STRENGTH_3] - the capabilities you told us matter most.

4. LET'S TALK
   Your account team will reach out this week to discuss your priorities and ensure we're delivering maximum value.

As always, I'm personally available if you have concerns or questions: [CEO_EMAIL] or [CEO_PHONE].

Thank you for your partnership.

[CEO_SIGNATURE]`,
    },
    {
      playbookId: playbook004.id,
      templateName: 'Sales Talking Points',
      templateType: 'employee_communication',
      subject: 'COMPETITIVE RESPONSE: [COMPETITOR_NAME] [PRODUCT] Launch',
      sendTiming: 'T+8:00',
      isRequired: true,
      variables: ['COMPETITOR_NAME', 'PRODUCT_TECHNOLOGY', 'OUR_ADVANTAGE_1', 'OUR_ADVANTAGE_2', 'OUR_ADVANTAGE_3', 'RETENTION_INCENTIVE'],
      recipientRoles: ['Sales Team', 'Customer Success', 'Support'],
      bodyTemplate: `COMPETITIVE RESPONSE: [COMPETITOR_NAME] [PRODUCT] Launch

SITUATION:
[COMPETITOR_NAME] announced [PRODUCT_TECHNOLOGY] that claims [BENEFIT_CAPABILITY]. Expect customers to ask how we compare.

KEY MESSAGES (Acknowledge, Differentiate, Redirect):

1. ACKNOWLEDGE THE ANNOUNCEMENT
   "Yes, we saw [COMPETITOR_NAME]'s announcement. It's an interesting approach and shows the industry is moving forward."

2. DIFFERENTIATE OUR APPROACH
   "Here's what makes us different and why it matters for enterprises like you..."
   
   [OUR_ADVANTAGE_1]: While they focus on [THEIR_APPROACH], we prioritize [OUR_APPROACH] because [CUSTOMER_BENEFIT]
   
   [OUR_ADVANTAGE_2]: [SPECIFIC_FEATURE] gives you [SPECIFIC_BENEFIT] that [COMPETITOR] doesn't offer
   
   [OUR_ADVANTAGE_3]: Our enterprise customers need [REQUIREMENT], which requires [OUR_CAPABILITY]

3. REDIRECT TO VALUE
   "Let's talk about your specific needs. What matters most to you: [PRIORITY_A], [PRIORITY_B], or [PRIORITY_C]?"

PROACTIVE OUTREACH:
- Contact your top 20 accounts this week
- Lead with: "I wanted to proactively address [COMPETITOR] announcement..."
- Listen for concerns, don't dismiss them
- Schedule executive briefing if needed

ESCALATION:
If customer seriously considering switch:
- Notify VP Sales immediately
- Request executive intervention
- Offer [RETENTION_INCENTIVE] if approved by manager`,
    },
    {
      playbookId: playbook004.id,
      templateName: 'Board Memo',
      templateType: 'board_memo',
      subject: 'Competitor Response - [COMPETITOR_NAME] [PRODUCT] Launch',
      sendTiming: 'T+24:00',
      isRequired: true,
      variables: ['CEO_NAME', 'COMPETITOR_NAME', 'PRODUCT_TECHNOLOGY', 'THREAT_SCORE', 'REVENUE_AT_RISK', 'RESPONSE_OPTION', 'BUDGET_ALLOCATED'],
      recipientRoles: ['Board of Directors', 'Board Chair', 'Lead Independent Director'],
      bodyTemplate: `TO: Board of Directors
FROM: [CEO_NAME]
DATE: [DATE]
RE: Competitor Response - [COMPETITOR_NAME] [PRODUCT] Launch

SITUATION:
[COMPETITOR_NAME] announced [PRODUCT_TECHNOLOGY] on [DATE]. Our AI monitoring detected the announcement and automatically activated Playbook #004 (Competitor Breakthrough Innovation).

THREAT ASSESSMENT:
Technology Gap: [TECH_GAP_MONTHS] months (AI evaluated)
Market Impact: [IMPACT_LEVEL] ([MEDIA_ARTICLES]+ articles, [SENTIMENT]% positive)
Customer Risk: [RISK_LEVEL] ([CUSTOMERS_ASKING] customers asked questions)
Financial Impact: $[REVENUE_AT_RISK]M revenue at risk if no response

RESPONSE EXECUTED (12-minute activation):
├─ Decision: [RESPONSE_OPTION]
├─ Budget: $[BUDGET_ALLOCATED]M (within CEO authority)
├─ Timeline: [EXECUTION_TIMELINE]
└─ Stakeholder Coordination: 8 executives, 224 employees mobilized

ACTIONS TAKEN:
[DETAILED_ACTIONS_LIST]

EARLY RESULTS (24 hours):
├─ Customer churn: [CHURN_COUNT] ([RETENTION_SUCCESS])
├─ Media sentiment: [MEDIA_SENTIMENT]% positive coverage
├─ Sales pipeline: [PIPELINE_IMPACT]
└─ Employee morale: [MORALE_ASSESSMENT]

BOARD DECISION REQUIRED:
[BOARD_ACTION_NEEDED or "None at this time"]`,
      reviewRequired: true,
      approvalLevel: 'CEO',
      estimatedDraftTime: 90,
    },
  ];

  await db.insert(playbookCommunicationTemplates).values(communicationTemplates);

  // SECTION 5: Task Sequences (75% Pre-filled)
  console.log('├─ Creating Task Sequences...');
  const taskSequences = [
    {
      playbookId: playbook004.id,
      sequence: 1,
      timing: 'T+0:00',
      timelinePhase: 'first_2_hours',
      taskName: 'AI Detects Competitor Announcement',
      taskDescription: 'AI monitoring system detects competitor announcement and calculates threat score. Deliverables: Threat assessment report, AI-generated brief (2 pages)',
      taskOwner: 'AI_SYSTEM',
      dependencies: [],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 2,
      timing: 'T+0:05',
      timelinePhase: 'first_2_hours',
      taskName: 'CEO SMS Alert',
      taskDescription: 'System sends SMS alert to CEO with playbook recommendation. Deliverable: SMS notification sent',
      taskOwner: 'AI_SYSTEM',
      dependencies: ['AI Detects Competitor Announcement'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 3,
      timing: 'T+0:30',
      timelinePhase: 'first_2_hours',
      taskName: 'CEO Activates Playbook',
      taskDescription: 'CEO reviews AI brief and confirms playbook activation (one click). Deliverables: Playbook activated, War room URL generated',
      taskOwner: 'CEO',
      dependencies: ['CEO SMS Alert'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 4,
      timing: 'T+0:35',
      timelinePhase: 'first_2_hours',
      taskName: 'Tier 1 Stakeholder Alerts',
      taskDescription: 'System sends alerts to 8 Tier 1 stakeholders (SMS + Email + Calendar). Deliverables: 8 stakeholder notifications sent, Calendar invites distributed',
      taskOwner: 'AI_SYSTEM',
      dependencies: ['CEO Activates Playbook'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 5,
      timing: 'T+2:00',
      timelinePhase: 'first_2_hours',
      taskName: 'War Room Assembled',
      taskDescription: 'All 8 Tier 1 stakeholders join virtual war room. Deliverables: 8/8 stakeholders joined, Screen share active',
      taskOwner: 'TIER_1_TEAM',
      dependencies: ['Tier 1 Stakeholder Alerts'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 6,
      timing: 'T+3:00',
      timelinePhase: 'first_2_hours',
      taskName: 'Decision Checkpoint #1: Severity Assessment',
      taskDescription: 'CTO presents technology gap analysis. Team decides if threat is real. Deliverables: Technology gap assessment, Severity decision',
      taskOwner: 'CTO',
      dependencies: ['War Room Assembled'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 7,
      timing: 'T+3:30',
      timelinePhase: 'first_24_hours',
      taskName: 'Tier 2 Stakeholder Notifications',
      taskDescription: 'System notifies 41 Tier 2 execution team members. Deliverable: 41 notifications sent',
      taskOwner: 'AI_SYSTEM',
      dependencies: ['Decision Checkpoint #1: Severity Assessment'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 8,
      timing: 'T+4:30',
      timelinePhase: 'first_24_hours',
      taskName: 'Decision Checkpoint #2: Response Strategy',
      taskDescription: 'CEO presents 3 options (Accelerate, Differentiate, Acquire). Team decides approach. Deliverables: Strategic decision, Budget allocation, Response plan',
      taskOwner: 'CEO',
      dependencies: ['Decision Checkpoint #1: Severity Assessment'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 9,
      timing: 'T+6:00',
      timelinePhase: 'first_24_hours',
      taskName: 'Execution Phase Initiated',
      taskDescription: 'CMO, CRO, CTO, CFO activate their respective work streams. Deliverables: Messaging activated, Retention program launched, Partnership discussions initiated',
      taskOwner: 'C_SUITE',
      dependencies: ['Decision Checkpoint #2: Response Strategy'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 10,
      timing: 'T+7:00',
      timelinePhase: 'first_24_hours',
      taskName: 'Tier 3 Notifications',
      taskDescription: 'System sends role-specific instructions to 183 Tier 3 stakeholders. Deliverables: 183 notifications sent, Talking points distributed',
      taskOwner: 'AI_SYSTEM',
      dependencies: ['Execution Phase Initiated'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 11,
      timing: 'T+8:00',
      timelinePhase: 'first_24_hours',
      taskName: 'External Communications Launched',
      taskDescription: 'Release media statement, customer emails, analyst briefings. Deliverables: Media statement released, Customer emails sent, Blog post published, Analyst briefings scheduled',
      taskOwner: 'CMO',
      dependencies: ['Execution Phase Initiated'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 12,
      timing: 'T+8:00',
      timelinePhase: 'first_24_hours',
      taskName: 'Internal Communications Launched',
      taskDescription: 'All-hands meeting, sales enablement, executive posts. Deliverables: All-hands scheduled, Sales talking points distributed, FAQ updated, Executive LinkedIn posts',
      taskOwner: 'CMO',
      dependencies: ['Execution Phase Initiated'],
      isRequired: true,
    },
    {
      playbookId: playbook004.id,
      sequence: 13,
      timing: 'T+12:00',
      timelinePhase: 'first_24_hours',
      taskName: 'Response Complete',
      taskDescription: 'All critical tasks assigned, monitoring dashboard activated. Deliverables: All tasks assigned with owners, Monitoring dashboard active, 24-hour checkpoint scheduled',
      taskOwner: 'CEO',
      dependencies: ['External Communications Launched', 'Internal Communications Launched'],
      isRequired: true,
    },
  ];

  await db.insert(playbookTaskSequences).values(taskSequences);

  console.log('✅ Playbook Templates seeded successfully!');
  console.log('   - Decision Trees: 2 checkpoints with 6 decision options');
  console.log('   - Communication Templates: 4 templates (media, customer, sales, board)');
  console.log('   - Task Sequences: 13 tasks spanning T+0 to T+12 hours');
}
