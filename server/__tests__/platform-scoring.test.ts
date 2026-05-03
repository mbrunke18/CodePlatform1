import { describe, it, expect } from 'vitest';

/**
 * Platform Scoring Algorithms
 *
 * These pure functions mirror the scoring logic in server/services/. They are
 * extracted here so they can be tested deterministically without a database.
 */

function calculateRiskScore(signals: number): number {
  return Math.min(100, Math.round(Math.sqrt(signals) * 8));
}

function classifyRiskLevel(score: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (score >= 75) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

function calculateVelocityScore(avgResponseTimeMinutes: number): number {
  if (avgResponseTimeMinutes <= 12) return 100;
  if (avgResponseTimeMinutes <= 20) return 90;
  if (avgResponseTimeMinutes <= 30) return 80;
  if (avgResponseTimeMinutes <= 45) return 70;
  if (avgResponseTimeMinutes <= 60) return 60;
  return Math.max(40, 100 - avgResponseTimeMinutes);
}

function calculateForesightScore(weakSignals: number, playbooksTotal: number): number {
  const signalScore = Math.min(100, weakSignals * 10);
  const playbookCoverage = playbooksTotal > 0 ? Math.min(100, playbooksTotal * 2) : 0;
  return Math.round(signalScore * 0.6 + playbookCoverage * 0.4);
}

function calculateAgilityScore(playbooksReady: number, playbooksTotal: number): number {
  if (playbooksTotal === 0) return 0;
  return Math.round((playbooksReady / playbooksTotal) * 100);
}

describe('Risk Scoring — √signals × 8 formula', () => {
  it('returns 0 for 0 signals', () => {
    expect(calculateRiskScore(0)).toBe(0);
  });

  it('scores correctly for 1 signal', () => {
    expect(calculateRiskScore(1)).toBe(8);
  });

  it('scores correctly for 4 signals', () => {
    expect(calculateRiskScore(4)).toBe(16);
  });

  it('scores correctly for 9 signals', () => {
    expect(calculateRiskScore(9)).toBe(24);
  });

  it('scores correctly for 16 signals', () => {
    expect(calculateRiskScore(16)).toBe(32);
  });

  it('scores correctly for 25 signals', () => {
    expect(calculateRiskScore(25)).toBe(40);
  });

  it('scores correctly for 100 signals', () => {
    expect(calculateRiskScore(100)).toBe(80);
  });

  it('caps at 100 regardless of signal count', () => {
    expect(calculateRiskScore(1000)).toBe(100);
    expect(calculateRiskScore(200)).toBe(100);
  });

  it('never returns a negative score', () => {
    expect(calculateRiskScore(0)).toBeGreaterThanOrEqual(0);
  });
});

describe('Risk Level Classification', () => {
  it('classifies score < 35 as LOW', () => {
    expect(classifyRiskLevel(0)).toBe('LOW');
    expect(classifyRiskLevel(20)).toBe('LOW');
    expect(classifyRiskLevel(34)).toBe('LOW');
  });

  it('classifies score 35 as MEDIUM (boundary)', () => {
    expect(classifyRiskLevel(35)).toBe('MEDIUM');
  });

  it('classifies scores 35–74 as MEDIUM', () => {
    expect(classifyRiskLevel(50)).toBe('MEDIUM');
    expect(classifyRiskLevel(74)).toBe('MEDIUM');
  });

  it('classifies score 75 as HIGH (boundary)', () => {
    expect(classifyRiskLevel(75)).toBe('HIGH');
  });

  it('classifies scores ≥ 75 as HIGH', () => {
    expect(classifyRiskLevel(80)).toBe('HIGH');
    expect(classifyRiskLevel(100)).toBe('HIGH');
  });

  it('round-trips correctly: 100 signals → HIGH', () => {
    const score = calculateRiskScore(100);
    expect(classifyRiskLevel(score)).toBe('HIGH');
  });

  it('round-trips correctly: 25 signals → MEDIUM', () => {
    const score = calculateRiskScore(25);
    expect(classifyRiskLevel(score)).toBe('MEDIUM');
  });

  it('round-trips correctly: 1 signal → LOW', () => {
    const score = calculateRiskScore(1);
    expect(classifyRiskLevel(score)).toBe('LOW');
  });
});

describe('Velocity Score — 12-minute benchmark', () => {
  it('returns 100 for exactly 12 minutes (perfect)', () => {
    expect(calculateVelocityScore(12)).toBe(100);
  });

  it('returns 100 for sub-12-minute response times', () => {
    expect(calculateVelocityScore(5)).toBe(100);
    expect(calculateVelocityScore(1)).toBe(100);
  });

  it('returns 90 for 13–20 minutes', () => {
    expect(calculateVelocityScore(13)).toBe(90);
    expect(calculateVelocityScore(20)).toBe(90);
  });

  it('returns 80 for 21–30 minutes', () => {
    expect(calculateVelocityScore(21)).toBe(80);
    expect(calculateVelocityScore(30)).toBe(80);
  });

  it('returns 70 for 31–45 minutes', () => {
    expect(calculateVelocityScore(31)).toBe(70);
    expect(calculateVelocityScore(45)).toBe(70);
  });

  it('returns 60 for 46–60 minutes', () => {
    expect(calculateVelocityScore(46)).toBe(60);
    expect(calculateVelocityScore(60)).toBe(60);
  });

  it('returns decreasing score beyond 60 minutes', () => {
    expect(calculateVelocityScore(61)).toBeLessThan(60);
  });

  it('enforces floor of 40 for very slow response times', () => {
    expect(calculateVelocityScore(200)).toBe(40);
    expect(calculateVelocityScore(500)).toBe(40);
  });
});

describe('Foresight Score', () => {
  it('returns 0 with no signals and no playbooks', () => {
    expect(calculateForesightScore(0, 0)).toBe(0);
  });

  it('maxes out signal contribution at 10 weak signals', () => {
    const scoreAt10 = calculateForesightScore(10, 0);
    const scoreAt20 = calculateForesightScore(20, 0);
    expect(scoreAt10).toBe(scoreAt20);
  });

  it('returns higher score with more playbooks', () => {
    const lower = calculateForesightScore(5, 10);
    const higher = calculateForesightScore(5, 30);
    expect(higher).toBeGreaterThan(lower);
  });

  it('caps total score at 100', () => {
    expect(calculateForesightScore(100, 100)).toBe(100);
  });

  it('weights signals at 60% and playbooks at 40%', () => {
    const score = calculateForesightScore(10, 50);
    expect(score).toBe(Math.round(100 * 0.6 + 100 * 0.4));
  });

  it('never returns a negative value', () => {
    expect(calculateForesightScore(0, 0)).toBeGreaterThanOrEqual(0);
  });
});

describe('Agility Score — Playbook Readiness Ratio', () => {
  it('returns 0 when no playbooks exist (avoid division by zero)', () => {
    expect(calculateAgilityScore(0, 0)).toBe(0);
  });

  it('returns 0 when no playbooks are ready', () => {
    expect(calculateAgilityScore(0, 50)).toBe(0);
  });

  it('returns 100 when all playbooks are ready', () => {
    expect(calculateAgilityScore(170, 170)).toBe(100);
  });

  it('returns 50 when half of playbooks are ready', () => {
    expect(calculateAgilityScore(85, 170)).toBe(50);
  });

  it('rounds to nearest integer', () => {
    const score = calculateAgilityScore(1, 3);
    expect(Number.isInteger(score)).toBe(true);
  });

  it('handles partial readiness in 170-protocol library', () => {
    const score = calculateAgilityScore(128, 170);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
    expect(score).toBe(Math.round((128 / 170) * 100));
  });
});
