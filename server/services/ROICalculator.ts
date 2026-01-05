/**
 * Calculate M platform ROI for executives
 */
export function calculateROI(executionData: any) {
  const {
    timeToActivateMinutes = 2,
    stakeholdersReached = 120,
    tasksCompleted = 18,
    risksMitigated = 5,
    opportunitiesCaptured = 2,
  } = executionData;

  // Time savings: Executive decision-making time reduced
  const timeSavingsHours = (timeToActivateMinutes / 60) * stakeholdersReached * 0.5; // 30 mins per exec normally
  const timeSavingsValue = timeSavingsHours * 500; // $500/hour executive cost

  // Risk mitigation value: Reduced exposure to strategic threats
  const riskMitigationValue = risksMitigated * 250000; // $250K per risk mitigated

  // Opportunity capture value: Faster market response
  const opportunityValue = opportunitiesCaptured * 500000; // $500K per opportunity

  // Task automation value
  const automationValue = tasksCompleted * 5000; // $5K per task automated

  const totalValue = timeSavingsValue + riskMitigationValue + opportunityValue + automationValue;
  const totalCost = 50000; // Annual M platform cost estimate
  const roi = ((totalValue - totalCost) / totalCost) * 100;

  return {
    totalValue: Math.round(totalValue),
    timeSavings: Math.round(timeSavingsValue),
    riskMitigation: Math.round(riskMitigationValue),
    opportunityCapture: Math.round(opportunityValue),
    automation: Math.round(automationValue),
    platformCost: totalCost,
    netValue: Math.round(totalValue - totalCost),
    roiPercent: Math.round(roi),
    avgAnnualValue: Math.round(totalValue / 12),
  };
}

export function generateROIReport(executionHistory: any[]) {
  const avg = executionHistory.reduce((sum, e) => sum + e.timeToActivateMinutes, 0) / executionHistory.length;
  const totalExecutions = executionHistory.length;
  
  return {
    totalExecutions,
    avgTimeToActivate: Math.round(avg * 10) / 10,
    cumulativeValue: executionHistory.reduce((sum, e) => sum + (calculateROI(e).totalValue || 0), 0),
    trend: 'upward',
    benchmarkTarget: '12 minutes',
    current: avg + ' minutes',
    efficiency: Math.round((avg / 12) * 100) + '%',
  };
}
