import type { ValueInsight } from "@/components/ValueInsightToast";

export const INSIGHTS = {
  triggerDetected: (): ValueInsight => ({
    id: `trigger-detected-${Date.now()}`,
    headline: "Trigger Detected",
    body: "External signal identified and classified. Without automated detection, this signal typically surfaces 24–72 hours later — after competitors have already responded.",
    metric: { label: "Time advantage captured", value: "~48 hrs" },
    duration: 8000,
  }),

  triggerClassified: (): ValueInsight => ({
    id: `trigger-classified-${Date.now()}`,
    headline: "Trigger Classified",
    body: "Category, domain, and severity confirmed. Manual triage of this signal typically takes 1–2 days and multiple senior stakeholders.",
    metric: { label: "Triage time eliminated", value: "~1.5 days" },
    duration: 8000,
  }),

  playbookActivated: (playbookName?: string): ValueInsight => ({
    id: `playbook-activated-${Date.now()}`,
    headline: "Readiness Protocol Activated",
    body: `${playbookName ? `"${playbookName}" loaded.` : "Protocol loaded."} Pre-staged actions ready for execution. Building this from scratch typically requires 2–3 weeks of cross-functional meetings.`,
    metric: { label: "Preparation time encoded", value: "~15 days" },
    duration: 9000,
  }),

  stakeholderNotified: (count?: number): ValueInsight => ({
    id: `stakeholder-notified-${Date.now()}`,
    headline: "Stakeholder Notification Initiated",
    body: `${count ? `${count} stakeholders` : "Stakeholders"} receiving role-specific instructions. Manual coordination typically requires 3–5 days of emails, calls, and follow-ups.`,
    metric: { label: "Coordination time saved", value: "~4 days" },
    duration: 8000,
  }),

  stakeholderNotificationComplete: (count?: number): ValueInsight => ({
    id: `stakeholder-complete-${Date.now()}`,
    headline: "Stakeholder Notification Complete",
    body: `${count ? `${count} stakeholders notified` : "All stakeholders notified"} with acknowledgment tracking active. Typical enterprise coordination for this step: 3–5 days.`,
    metric: { label: "3,600× faster than baseline", value: "Minutes" },
    duration: 9000,
  }),

  taskAssigned: (owner?: string): ValueInsight => ({
    id: `task-assigned-${Date.now()}`,
    headline: "Action Assigned",
    body: `Action locked to ${owner || "an owner"} with a clear deadline. Action items without ownership have a 60% failure rate. This one is locked.`,
    metric: { label: "Execution accountability", value: "Locked" },
    duration: 7000,
  }),

  taskCompleted: (taskName?: string): ValueInsight => ({
    id: `task-completed-${Date.now()}`,
    headline: "Action Completed",
    body: `${taskName ? `"${taskName}"` : "Action"} completed and logged. Completion data improves future Readiness Protocol accuracy.`,
    metric: { label: "Playbook learning", value: "+1 data point" },
    duration: 7000,
  }),

  executionComplete: (): ValueInsight => ({
    id: `execution-complete-${Date.now()}`,
    headline: "Execution Complete",
    body: "Full coordination cycle closed. Decision documented. No ambiguity about what was decided, by whom, or when. This audit trail typically doesn't exist in manual execution.",
    metric: { label: "30 days compressed to", value: "12 minutes" },
    duration: 10000,
  }),

  escalationTriggered: (item?: string): ValueInsight => ({
    id: `escalation-${Date.now()}`,
    headline: "Escalation Triggered",
    body: `${item ? `"${item}"` : "A blocked item"} auto-escalated before it caused a delay. Without automated escalation, blocked items typically sit unaddressed for 5–10 days.`,
    metric: { label: "Delay prevented", value: "~7 days" },
    duration: 8000,
  }),

  decisionOwnerConfirmed: (): ValueInsight => ({
    id: `decision-owner-${Date.now()}`,
    headline: "Decision Owner Confirmed",
    body: "Authority level and approval chain confirmed. Determining decision ownership typically requires 2–3 meetings and 5–7 days of organizational navigation.",
    metric: { label: "Decision clarity", value: "Immediate" },
    duration: 8000,
  }),
};
