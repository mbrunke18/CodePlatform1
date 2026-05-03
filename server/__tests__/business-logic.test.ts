import { describe, it, expect } from 'vitest';

function calculateTaskValue(task: any): number {
  const baseValue = 500;

  const priorityMultipliers: Record<string, number> = {
    critical: 4.0,
    high: 2.5,
    medium: 1.5,
    low: 1.0,
  };
  const priorityMultiplier = priorityMultipliers[task?.priority] ?? 1.0;

  const strategicKeywords = ['strategic', 'executive', 'crisis', 'decision', 'revenue', 'compliance', 'risk'];
  const hasStrategicKeyword = strategicKeywords.some(kw =>
    (task?.description ?? '').toLowerCase().includes(kw)
  );
  const complexityBonus = hasStrategicKeyword ? 1000 : 0;

  return Math.floor(baseValue * priorityMultiplier + complexityBonus);
}

describe('calculateTaskValue', () => {
  it('calculates medium priority task with no strategic keywords', () => {
    const value = calculateTaskValue({ description: 'Simple task', priority: 'medium' });
    expect(value).toBe(750);
  });

  it('applies critical priority multiplier (4×)', () => {
    const value = calculateTaskValue({ description: 'System update', priority: 'critical' });
    expect(value).toBe(2000);
  });

  it('applies high priority multiplier (2.5×)', () => {
    const value = calculateTaskValue({ description: 'Important task', priority: 'high' });
    expect(value).toBe(1250);
  });

  it('applies low priority multiplier (1×)', () => {
    const value = calculateTaskValue({ description: 'Minor fix', priority: 'low' });
    expect(value).toBe(500);
  });

  it('adds $1,000 complexity bonus for a strategic keyword match', () => {
    const value = calculateTaskValue({
      description: 'Strategic decision for revenue and crisis management',
      priority: 'high',
    });
    expect(value).toBe(2250);
  });

  it('adds complexity bonus for any single keyword — "risk"', () => {
    const value = calculateTaskValue({ description: 'Evaluate risk exposure', priority: 'medium' });
    expect(value).toBe(1750);
  });

  it('adds complexity bonus for "compliance" keyword', () => {
    const value = calculateTaskValue({ description: 'Compliance audit preparation', priority: 'low' });
    expect(value).toBe(1500);
  });

  it('uses default multiplier for unknown priority', () => {
    const value = calculateTaskValue({ description: 'Random task', priority: 'unknown' });
    expect(value).toBe(500);
  });

  it('handles null description gracefully', () => {
    const value = calculateTaskValue({ description: null, priority: 'medium' });
    expect(value).toBe(750);
  });

  it('handles missing description field gracefully', () => {
    const value = calculateTaskValue({ priority: 'high' });
    expect(value).toBe(1250);
  });

  it('handles empty object without throwing', () => {
    expect(() => calculateTaskValue({})).not.toThrow();
    expect(calculateTaskValue({})).toBe(500);
  });

  it('handles null task without throwing', () => {
    expect(() => calculateTaskValue(null)).not.toThrow();
  });

  it('critical + strategic keyword yields highest value', () => {
    const value = calculateTaskValue({ description: 'Executive strategic initiative', priority: 'critical' });
    expect(value).toBe(3000);
  });
});
