export interface AdvanceCategoryData {
  category: string;
  priorActivation: string;
  updateApplied: string;
  hypothesis: string;
  expectedDelta: string;
  provenStatus: "Proven" | "Measuring";
  measuredResult: string;
  learningVelocity: {
    updatesApplied: number;
    provenImprovements: number;
    minutesSaved: number;
    pctLibraryEvidenceBacked: number;
    moatMonths: string;
  };
}

export const ADVANCE_DATA: Record<string, AdvanceCategoryData> = {
  "RISK & RESILIENCE": {
    category: "RISK & RESILIENCE",
    priorActivation: "Prior activation of a resilience protocol surfaced a 6-minute gap between signal detection and stakeholder acknowledgment — traced to a single-channel notification path.",
    updateApplied: "Notification path updated from single-channel to tri-channel (SMS + Teams + voice escalation) with a 90-second auto-escalation if unacknowledged.",
    hypothesis: "This protocol's next activation will reach full stakeholder acknowledgment 4 minutes faster than the prior run.",
    expectedDelta: "−4 min",
    provenStatus: "Proven",
    measuredResult: "The next activation of this protocol acknowledged all stakeholders in 1:52 — 4 minutes 8 seconds faster than the version this replaced. Hypothesis proven.",
    learningVelocity: { updatesApplied: 34, provenImprovements: 21, minutesSaved: 612, pctLibraryEvidenceBacked: 42, moatMonths: "14–18 months" },
  },
  "GROWTH & POSITIONING": {
    category: "GROWTH & POSITIONING",
    priorActivation: "Prior activation of a growth protocol showed the top-100 target account list took 90 minutes to rank and route to enterprise AEs — slower than every other staged task.",
    updateApplied: "Target-account ranking now pre-computed and refreshed weekly against live CRM data, so the list is staged — not built — the moment the protocol activates.",
    hypothesis: "This protocol's next activation will route the ranked account list to AEs in under 5 minutes instead of 90.",
    expectedDelta: "−85 min",
    provenStatus: "Proven",
    measuredResult: "The next activation routed the full ranked account list in 4 minutes — an 86-minute improvement. Hypothesis proven.",
    learningVelocity: { updatesApplied: 19, provenImprovements: 12, minutesSaved: 340, pctLibraryEvidenceBacked: 38, moatMonths: "12–16 months" },
  },
  TRANSFORMATION: {
    category: "TRANSFORMATION",
    priorActivation: "Prior activation of a transformation protocol showed cross-country legal sign-off (12 jurisdictions) was the long pole — sequential review added 2 days to mobilization.",
    updateApplied: "Legal sign-off restructured from sequential to parallel review with jurisdiction-specific pre-cleared templates for the 8 most common transformation triggers.",
    hypothesis: "This protocol's next activation will complete multi-jurisdiction legal sign-off in under 6 hours instead of 2 days.",
    expectedDelta: "−1.75 days",
    provenStatus: "Measuring",
    measuredResult: "This update was applied after the most recent close-out. The next activation of this protocol will be the first measured test of the hypothesis.",
    learningVelocity: { updatesApplied: 11, provenImprovements: 6, minutesSaved: 158, pctLibraryEvidenceBacked: 29, moatMonths: "10–14 months" },
  },
};

export function getAdvanceDataForCategory(category: string): AdvanceCategoryData {
  return ADVANCE_DATA[category] ?? ADVANCE_DATA["RISK & RESILIENCE"];
}
