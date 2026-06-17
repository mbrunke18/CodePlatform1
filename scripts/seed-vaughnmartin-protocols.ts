/**
 * VaughnMartin — Three Live Readiness Protocols
 * Real business triggers VaughnMartin actually faces.
 * Run with: npx tsx scripts/seed-vaughnmartin-protocols.ts
 */

import { db } from "../server/db";
import { playbooks } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const VM_ORG_ID = "c4e5f6a7-b8c9-4d0e-bf1a-2c3d4e5f6a7b";

const PROTOCOLS = [
  {
    name: "Founding Partner Inquiry Response",
    domain: "Market Dynamics",
    category: "offense",
    sourceType: "custom",
    priority: "high",
    description:
      "A qualified prospect expresses interest in the Founding Partner Program — requests materials, asks for a call, or submits the access form. This protocol stages the full response: materials assembled, outreach personalized, discovery call scheduled, and follow-up cadence set. Target: first response within 12 minutes of inquiry detection.",
    triggerConditions: [
      {
        id: "t1",
        description: "Prospect submits Founding Partner access form",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
      {
        id: "t2",
        description: "Prospect replies to outreach expressing interest",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
      {
        id: "t3",
        description: "Prospect requests a demo or discovery call",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
    ],
    stakeholders: [
      {
        role: "Executive Authorizer",
        responsibility: "Review prospect profile and authorize personalized outreach approach",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "PMO Director",
        responsibility: "Stage materials package and manage follow-up cadence",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "Functional Lead",
        responsibility: "Send response, schedule discovery call, log activity",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
    ],
    executionSteps: [
      {
        id: "s1",
        order: 1,
        title: "Acknowledge the inquiry",
        description:
          "Send a brief acknowledgment within 12 minutes confirming receipt and that personalized materials are incoming. Do not send the full package yet — personalization comes in Step 4.",
        timeTargetMinutes: 2,
        isParallel: false,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Acknowledgment sent — timestamp logged",
      },
      {
        id: "s2",
        order: 2,
        title: "Stage the Founding Partner materials package",
        description:
          "Pull the Executive Brief, ROI Calculator link, Proof Story page URL, and Founding Partner Program overview. Confirm all links are live and current before sending.",
        timeTargetMinutes: 3,
        isParallel: true,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Materials package ready: Executive Brief + ROI Calculator + Proof Story + Program overview",
      },
      {
        id: "s3",
        order: 3,
        title: "Profile the prospect",
        description:
          "Review what is known: company size, industry, how they found us, any prior touchpoints. Note the most relevant proof scenario (Ransomware, Activist Investor, Supply Chain, etc.) to lead with.",
        timeTargetMinutes: 3,
        isParallel: true,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Prospect profile note: industry, company size, recommended proof scenario",
      },
      {
        id: "s4",
        order: 4,
        title: "Executive Authorizer reviews and approves outreach approach",
        description:
          "Review prospect profile and confirm the personalization angle. Approve the materials package for send. This is the authorization gate — no full outreach goes without sign-off.",
        timeTargetMinutes: 3,
        isParallel: false,
        dependsOn: ["s2", "s3"],
        approvalRequired: "c_suite",
        approvalNotes: "Executive confirms personalization angle and approves materials for send",
        deliverables: "Authorization recorded — outreach approved",
      },
      {
        id: "s5",
        order: 5,
        title: "Send personalized response with materials",
        description:
          "Send the tailored response referencing their specific industry and the most relevant proof scenario. Include direct links to Executive Brief and the 12-Minute Test Drive. Propose two specific discovery call times.",
        timeTargetMinutes: 3,
        isParallel: false,
        dependsOn: ["s4"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Response sent — timestamped — call times proposed",
      },
      {
        id: "s6",
        order: 6,
        title: "Set follow-up cadence",
        description:
          "Log the prospect in pipeline. Set a 48-hour follow-up reminder if no reply. Set a 5-day check-in if no meeting booked. PMO Director owns cadence from this point.",
        timeTargetMinutes: 2,
        isParallel: false,
        dependsOn: ["s5"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Pipeline entry created — follow-up cadence set",
      },
    ],
    businessImpacts: [
      {
        id: "bi1",
        type: "revenue_protection",
        estimatedValue: 120000,
        valueUnit: "USD",
        description: "Average Founding Partner contract value protected by 12-minute response vs. delayed follow-up",
        measurementMethod: "Contract conversion rate comparison: <12min response vs. >24hr response",
      },
    ],
    successMetrics: {
      responseTimeTarget: 12,
      stakeholdersTarget: 3,
      customMetrics: [
        { name: "First response time", target: "Under 12 minutes from inquiry" },
        { name: "Discovery call booked", target: "Within 48 hours of outreach" },
        { name: "Materials open rate", target: "Confirm prospect opened Executive Brief" },
      ],
    },
    riskScore: 6,
    status: "ready",
    completionPercentage: 100,
    leadershipCapability: "agility",
    playbookOwner: "Marty Brunke",
    playbookOwnerEmail: "mbrunke@vaughnmartin.com",
    preApprovedMessaging:
      "Thank you for your interest in VaughnMartin Readiness OS. I'm preparing a tailored materials package for you now and will have it in your inbox within the hour. In the meantime, the 12-Minute Test Drive at [URL] shows exactly how the platform executes — no login required.",
  },

  {
    name: "Competitive Intelligence Response",
    domain: "Market Dynamics",
    category: "offense",
    sourceType: "custom",
    priority: "high",
    description:
      "A competitor makes a move — announces a product, publishes positioning that overlaps with Readiness OS, lands press coverage, or enters a conversation with one of our prospects. This protocol stages the counter-response: positioning updated, Founding Partners briefed, active prospect conversations reinforced before the competitor's message settles.",
    triggerConditions: [
      {
        id: "t1",
        description: "Competitor announces new product or feature overlapping with Readiness OS positioning",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
      {
        id: "t2",
        description: "Competitor mentioned by an active prospect or Founding Partner",
        source: "manual",
        severity: "warning",
        autoActivate: false,
      },
      {
        id: "t3",
        description: "Competitor lands significant press coverage or analyst mention",
        source: "system",
        severity: "warning",
        autoActivate: false,
      },
    ],
    stakeholders: [
      {
        role: "Executive Authorizer",
        responsibility: "Assess competitive threat and authorize positioning response",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "PMO Director",
        responsibility: "Brief active Founding Partners and coordinate messaging consistency",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "Functional Lead",
        responsibility: "Update prospect-facing materials and reinforce active conversations",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
    ],
    executionSteps: [
      {
        id: "s1",
        order: 1,
        title: "Capture and document the intelligence",
        description:
          "Record exactly what the competitor announced, where it appeared, and what claim they are making. Screenshot or link the source. Note any overlap with current Readiness OS prospect conversations.",
        timeTargetMinutes: 3,
        isParallel: false,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Intelligence brief: what, where, overlap assessment",
      },
      {
        id: "s2",
        order: 2,
        title: "Executive Authorizer assesses threat level and approves response",
        description:
          "Review the intelligence brief. Classify threat: Low (awareness only), Medium (prospect conversations at risk), High (direct displacement threat). Authorize response approach.",
        timeTargetMinutes: 4,
        isParallel: false,
        dependsOn: ["s1"],
        approvalRequired: "c_suite",
        approvalNotes: "Executive classifies threat level and authorizes counter-response approach",
        deliverables: "Threat classification recorded — response approach authorized",
      },
      {
        id: "s3",
        order: 3,
        title: "Sharpen the differentiation statement",
        description:
          "Update the one-line differentiation response to this specific competitor move. Reference 3,600× Execution Head Start, the operating model layer positioning, and why this competitor is still bolting AI onto the old model. Keep it factual and timestamp-based.",
        timeTargetMinutes: 5,
        isParallel: false,
        dependsOn: ["s2"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Updated differentiation statement — approved and ready to deploy",
      },
      {
        id: "s4",
        order: 4,
        title: "Brief active Founding Partners",
        description:
          "If any active Founding Partners are in conversations that may be affected, send a brief proactive note. Frame it as intelligence sharing, not defensiveness. One paragraph max.",
        timeTargetMinutes: 5,
        isParallel: true,
        dependsOn: ["s3"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Founding Partner brief sent — or confirmed not required",
      },
      {
        id: "s5",
        order: 5,
        title: "Reinforce active prospect conversations",
        description:
          "For any prospects currently in conversation, send a tailored note that reinforces Readiness OS differentiation in light of the competitive development. Use the updated differentiation statement from Step 3.",
        timeTargetMinutes: 5,
        isParallel: true,
        dependsOn: ["s3"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Active prospects reinforced — activity logged",
      },
    ],
    businessImpacts: [
      {
        id: "bi1",
        type: "revenue_protection",
        estimatedValue: 240000,
        valueUnit: "USD",
        description: "Active Founding Partner pipeline protected from competitive displacement",
        measurementMethod: "Pipeline retention rate before and after competitive events",
      },
    ],
    successMetrics: {
      responseTimeTarget: 12,
      stakeholdersTarget: 3,
      customMetrics: [
        { name: "Response time to competitive event", target: "Differentiation statement updated within 12 minutes" },
        { name: "Active prospect reinforcement", target: "100% of active conversations touched within 24 hours" },
      ],
    },
    riskScore: 7,
    status: "ready",
    completionPercentage: 100,
    leadershipCapability: "agility",
    playbookOwner: "Marty Brunke",
    playbookOwnerEmail: "mbrunke@vaughnmartin.com",
    preApprovedMessaging:
      "I wanted to share something I thought you'd find useful — [competitor] made an announcement today. Here's the distinction that matters: they're still working within the meeting-heavy operating model. Readiness OS replaces that model entirely. The timestamp is the proof — [12-minute execution URL].",
  },

  {
    name: "Investor Outreach Response",
    domain: "Financial",
    category: "offense",
    sourceType: "custom",
    priority: "critical",
    description:
      "An investor expresses interest — requests the deck, asks for a data room, proposes a meeting, or is referred by a third party. Speed of response signals operational competence before a word is spoken. This protocol stages the full investor response: materials assembled, executive brief personalized, meeting scheduled, and follow-up managed. Target: first response within 12 minutes.",
    triggerConditions: [
      {
        id: "t1",
        description: "Investor requests pitch deck or investor materials",
        source: "manual",
        severity: "critical",
        autoActivate: false,
      },
      {
        id: "t2",
        description: "Warm intro or referral from investor network",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
      {
        id: "t3",
        description: "Investor requests meeting or discovery call",
        source: "manual",
        severity: "critical",
        autoActivate: false,
      },
      {
        id: "t4",
        description: "Investor follows up on prior contact",
        source: "manual",
        severity: "urgent",
        autoActivate: false,
      },
    ],
    stakeholders: [
      {
        role: "Executive Authorizer",
        responsibility: "Review investor profile, personalize the narrative, authorize materials release",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "PMO Director",
        responsibility: "Stage investor package, coordinate data room access if required, manage follow-up",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
      {
        role: "Functional Lead",
        responsibility: "Send materials, confirm receipt, schedule meeting",
        notificationChannels: ["email", "in_app"],
        isBackup: false,
      },
    ],
    executionSteps: [
      {
        id: "s1",
        order: 1,
        title: "Acknowledge within 12 minutes",
        description:
          "Send a brief, professional acknowledgment immediately. Confirm materials are being prepared. Do not send the full package until the executive has reviewed and personalized the approach in Step 3.",
        timeTargetMinutes: 2,
        isParallel: false,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Acknowledgment sent — timestamp logged",
      },
      {
        id: "s2",
        order: 2,
        title: "Stage the investor package",
        description:
          "Assemble: Investor deck (latest version), Executive Brief (print-ready PDF), Proof Story page link, ROI Calculator link, Security & Compliance one-pager, and Founders contact details. Verify all documents are current and links are live.",
        timeTargetMinutes: 4,
        isParallel: true,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables:
          "Investor package staged: deck + Executive Brief + Proof Story + ROI Calculator + Security & Compliance",
      },
      {
        id: "s3",
        order: 3,
        title: "Profile the investor",
        description:
          "Research the investor: fund thesis, portfolio, check size, stage focus, any mutual connections. Identify the most compelling angle — market size, 81% problem stat, Microsoft operating model gap, or 3,600× head start — for this specific investor profile.",
        timeTargetMinutes: 5,
        isParallel: true,
        dependsOn: [],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Investor profile note: fund thesis, portfolio fit, recommended narrative angle",
      },
      {
        id: "s4",
        order: 4,
        title: "Executive Authorizer personalizes narrative and approves send",
        description:
          "Review investor profile and confirm the personalization angle. Write the two-sentence narrative hook for the cover email. Authorize materials release. This is the authorization gate — no investor package sends without sign-off.",
        timeTargetMinutes: 4,
        isParallel: false,
        dependsOn: ["s2", "s3"],
        approvalRequired: "c_suite",
        approvalNotes:
          "Executive writes narrative hook and authorizes investor package for release",
        deliverables: "Authorization recorded — personalized narrative approved — package cleared for send",
      },
      {
        id: "s5",
        order: 5,
        title: "Send investor package with personalized cover",
        description:
          "Send the package with the approved narrative hook. Lead with the problem (81% no bottom-line gains, organization is the constraint), the solution (Readiness OS as the operating model layer), and the proof (3,600× head start). Propose two specific meeting times.",
        timeTargetMinutes: 3,
        isParallel: false,
        dependsOn: ["s4"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Package sent — meeting times proposed — timestamp logged",
      },
      {
        id: "s6",
        order: 6,
        title: "Confirm receipt and log in pipeline",
        description:
          "Confirm investor received materials (read receipt or direct reply). Log in investor pipeline with stage, contact details, narrative angle used, and follow-up date. PMO Director owns pipeline from this point.",
        timeTargetMinutes: 2,
        isParallel: false,
        dependsOn: ["s5"],
        approvalRequired: "none",
        approvalNotes: "",
        deliverables: "Receipt confirmed — investor pipeline updated — follow-up date set",
      },
    ],
    businessImpacts: [
      {
        id: "bi1",
        type: "revenue_protection",
        estimatedValue: 1000000,
        valueUnit: "USD",
        description: "Funding round value protected by demonstrating operational competence through 12-minute response time",
        measurementMethod:
          "Investor meeting conversion rate: <12min first response vs. delayed",
      },
    ],
    successMetrics: {
      responseTimeTarget: 12,
      stakeholdersTarget: 3,
      customMetrics: [
        { name: "Acknowledgment time", target: "Under 12 minutes from first contact" },
        { name: "Full package sent", target: "Within 2 hours of acknowledgment" },
        { name: "Meeting scheduled", target: "Within 48 hours of package send" },
        { name: "Pipeline logged", target: "Same day as outreach" },
      ],
    },
    riskScore: 9,
    status: "ready",
    completionPercentage: 100,
    leadershipCapability: "agility",
    playbookOwner: "Marty Brunke",
    playbookOwnerEmail: "mbrunke@vaughnmartin.com",
    investorNotificationRequired: true,
    preApprovedMessaging:
      "Thank you for reaching out. VaughnMartin is building the operating model layer that makes enterprise AI investment generate P&L impact — 81% of organizations deploying AI haven't seen bottom-line gains yet because the constraint is organizational, not technological. I'm preparing a tailored package for you now. You'll have it within the hour.",
  },
];

async function main() {
  console.log("── VaughnMartin Protocol Seeding ────────────────────────────");

  let created = 0;
  let skipped = 0;

  for (const protocol of PROTOCOLS) {
    const existing = await db
      .select({ id: playbooks.id })
      .from(playbooks)
      .where(
        and(
          eq(playbooks.organizationId, VM_ORG_ID),
          eq(playbooks.name, protocol.name)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(`↺  Already exists: "${protocol.name}"`);
      skipped++;
      continue;
    }

    await db.insert(playbooks).values({
      organizationId: VM_ORG_ID,
      sourceType: protocol.sourceType,
      name: protocol.name,
      domain: protocol.domain,
      category: protocol.category,
      description: protocol.description,
      priority: protocol.priority,
      triggerConditions: protocol.triggerConditions,
      stakeholders: protocol.stakeholders,
      executionSteps: protocol.executionSteps,
      businessImpacts: protocol.businessImpacts,
      successMetrics: protocol.successMetrics,
      riskScore: protocol.riskScore,
      status: protocol.status as "ready",
      completionPercentage: protocol.completionPercentage,
      leadershipCapability: protocol.leadershipCapability,
      playbookOwner: protocol.playbookOwner,
      playbookOwnerEmail: protocol.playbookOwnerEmail,
      preApprovedMessaging: protocol.preApprovedMessaging ?? null,
      investorNotificationRequired: (protocol as any).investorNotificationRequired ?? false,
      isActive: true,
      isTemplate: false,
    });

    console.log(`+  Created: "${protocol.name}"`);
    created++;
  }

  console.log("");
  console.log(`── Done ─────────────────────────────────────────────────────`);
  console.log(`   Created : ${created} protocol(s)`);
  console.log(`   Skipped : ${skipped} (already existed)`);
  console.log(`   Org     : VaughnMartin (${VM_ORG_ID})`);
  console.log("");
  console.log("These protocols are live in the VaughnMartin org.");
  console.log("Activate one when the next real trigger fires.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
