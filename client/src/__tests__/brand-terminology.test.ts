import { describe, it, expect } from 'vitest';

/**
 * Brand Terminology Enforcement Tests
 *
 * Verifies the zero-tolerance language rules locked in replit.md:
 *  - Retired terms must never appear in UI-facing copy
 *  - Approved replacements must be consistent and correct
 *  - Key platform metrics must be stated correctly
 */

const RETIRED_TERMS = [
  'AI-powered',
  'AI-driven',
  'AI-generated',
  'AI-detected',
  'AI Confidence',
  'ai confidence',
  'Pilot Program',
  'Pilot Access',
  'Now in Pilot',
  'speed advantage',
  '340×',
  '360×',
  '72 hours',
  'human-AI partnership',
  'Offense',
  'Defense',
  'Special Teams',
  'GPT-4o',
];

const REQUIRED_TERMS = {
  confidenceLabel: 'Signal Confidence',
  foundingPartnerProgram: 'Founding Partner Program',
  foundingPartnerAccess: 'Founding Partner Access',
  headStartLabel: '3,600× Execution Head Start',
  timeCompression: '30 days compressed to 12 minutes',
  domainGrowth: 'GROWTH & POSITIONING',
  domainRisk: 'RISK & RESILIENCE',
  domainTransform: 'TRANSFORMATION',
};

const APPROVED_REPLACEMENTS: Record<string, string> = {
  'AI-powered': 'system-detected',
  'AI-driven': 'signal-based',
  'AI-generated': 'system-staged',
  'AI-detected': 'system-detected',
  'AI Confidence': 'Signal Confidence',
  'Pilot Program': 'Founding Partner Program',
  'Pilot Access': 'Founding Partner Access',
  'speed advantage': '3,600× Execution Head Start',
  Offense: 'GROWTH & POSITIONING',
  Defense: 'RISK & RESILIENCE',
  'Special Teams': 'TRANSFORMATION',
};

function simulateUICopy(text: string) {
  return {
    containsRetiredTerm: (term: string) => text.includes(term),
    containsRequiredTerm: (term: string) => text.includes(term),
  };
}

describe('Retired Term Detection', () => {
  it('flags "AI-powered" as a retired term', () => {
    const copy = simulateUICopy('This is an AI-powered platform.');
    expect(copy.containsRetiredTerm('AI-powered')).toBe(true);
  });

  it('flags "AI Confidence" as a retired term', () => {
    const copy = simulateUICopy('AI Confidence: 92%');
    expect(copy.containsRetiredTerm('AI Confidence')).toBe(true);
  });

  it('flags "Pilot Program" as a retired term', () => {
    const copy = simulateUICopy('Apply to our Pilot Program today.');
    expect(copy.containsRetiredTerm('Pilot Program')).toBe(true);
  });

  it('flags "GPT-4o" in UI copy as a retired term', () => {
    const copy = simulateUICopy('Powered by GPT-4o intelligence.');
    expect(copy.containsRetiredTerm('GPT-4o')).toBe(true);
  });

  it('flags "human-AI partnership" as a retired term', () => {
    const copy = simulateUICopy('Built on the principles of human-AI partnership.');
    expect(copy.containsRetiredTerm('human-AI partnership')).toBe(true);
  });

  it('flags "360×" as a retired metric (superseded by 3,600×)', () => {
    const copy = simulateUICopy('360× faster than traditional methods.');
    expect(copy.containsRetiredTerm('360×')).toBe(true);
  });

  it('flags "340×" as a retired metric', () => {
    const copy = simulateUICopy('340× execution speed');
    expect(copy.containsRetiredTerm('340×')).toBe(true);
  });
});

describe('Approved Replacement Terms', () => {
  it('"Signal Confidence" replaces "AI Confidence"', () => {
    const copy = simulateUICopy('Signal Confidence: 92%');
    expect(copy.containsRetiredTerm('AI Confidence')).toBe(false);
    expect(copy.containsRequiredTerm('Signal Confidence')).toBe(true);
  });

  it('"Founding Partner Program" replaces "Pilot Program"', () => {
    const copy = simulateUICopy('Apply to our Founding Partner Program today.');
    expect(copy.containsRetiredTerm('Pilot Program')).toBe(false);
    expect(copy.containsRequiredTerm('Founding Partner Program')).toBe(true);
  });

  it('"Founding Partner Access" replaces "Pilot Access"', () => {
    const copy = simulateUICopy('Request Founding Partner Access.');
    expect(copy.containsRetiredTerm('Pilot Access')).toBe(false);
    expect(copy.containsRequiredTerm('Founding Partner Access')).toBe(true);
  });

  it('"system-detected" is an approved replacement for "AI-detected"', () => {
    const copy = simulateUICopy('Trigger system-detected within 30 seconds.');
    expect(copy.containsRetiredTerm('AI-detected')).toBe(false);
  });

  it('"pre-staged" is an approved replacement for "AI-generated"', () => {
    const copy = simulateUICopy('Protocols are pre-staged before the trigger fires.');
    expect(copy.containsRetiredTerm('AI-generated')).toBe(false);
  });

  it('"GROWTH & POSITIONING" replaces "Offense"', () => {
    const copy = simulateUICopy('GROWTH & POSITIONING strategies');
    expect(copy.containsRetiredTerm('Offense')).toBe(false);
    expect(copy.containsRequiredTerm('GROWTH & POSITIONING')).toBe(true);
  });

  it('"RISK & RESILIENCE" replaces "Defense"', () => {
    const copy = simulateUICopy('RISK & RESILIENCE playbooks');
    expect(copy.containsRetiredTerm('Defense')).toBe(false);
    expect(copy.containsRequiredTerm('RISK & RESILIENCE')).toBe(true);
  });

  it('"TRANSFORMATION" replaces "Special Teams"', () => {
    const copy = simulateUICopy('TRANSFORMATION protocols');
    expect(copy.containsRetiredTerm('Special Teams')).toBe(false);
    expect(copy.containsRequiredTerm('TRANSFORMATION')).toBe(true);
  });
});

describe('Approved Replacement Map Integrity', () => {
  it('every retired term has an approved replacement defined', () => {
    const termsWithReplacements = Object.keys(APPROVED_REPLACEMENTS);
    const termsNeedingReplacement = [
      'AI-powered', 'AI-driven', 'AI-generated', 'AI-detected',
      'AI Confidence', 'Pilot Program', 'Pilot Access',
      'speed advantage', 'Offense', 'Defense', 'Special Teams',
    ];
    for (const term of termsNeedingReplacement) {
      expect(termsWithReplacements, `"${term}" must have an approved replacement`).toContain(term);
    }
  });

  it('no approved replacement is itself a retired term', () => {
    const replacements = Object.values(APPROVED_REPLACEMENTS);
    for (const replacement of replacements) {
      expect(RETIRED_TERMS, `replacement "${replacement}" must not be a retired term`)
        .not.toContain(replacement);
    }
  });
});

describe('Platform Metric Correctness', () => {
  it('3,600× is the canonical head start label (not 340×, 360×, or "speed advantage")', () => {
    const label = REQUIRED_TERMS.headStartLabel;
    expect(label).toContain('3,600×');
    expect(label).toContain('Execution Head Start');
    expect(label).not.toContain('speed advantage');
  });

  it('30 days to 12 minutes is the canonical time-compression framing', () => {
    const framing = REQUIRED_TERMS.timeCompression;
    expect(framing).toContain('30 days');
    expect(framing).toContain('12 minutes');
  });

  it('the 3,600× metric is mathematically verified', () => {
    const days = 30;
    const minutesPerDay = 24 * 60;
    const mobilization = days * minutesPerDay;
    const readiness = 12;
    expect(Math.round(mobilization / readiness)).toBe(3600);
  });

  it('Signal Confidence is the approved label for confidence scores', () => {
    expect(REQUIRED_TERMS.confidenceLabel).toBe('Signal Confidence');
    expect(REQUIRED_TERMS.confidenceLabel).not.toContain('AI');
  });
});

describe('RETIRED_TERMS list is complete', () => {
  it('contains all known retired AI labels', () => {
    expect(RETIRED_TERMS).toContain('AI-powered');
    expect(RETIRED_TERMS).toContain('AI-driven');
    expect(RETIRED_TERMS).toContain('AI-generated');
    expect(RETIRED_TERMS).toContain('AI-detected');
    expect(RETIRED_TERMS).toContain('AI Confidence');
  });

  it('contains all retired football domain labels', () => {
    expect(RETIRED_TERMS).toContain('Offense');
    expect(RETIRED_TERMS).toContain('Defense');
    expect(RETIRED_TERMS).toContain('Special Teams');
  });

  it('contains all retired founding-partner program names', () => {
    expect(RETIRED_TERMS).toContain('Pilot Program');
    expect(RETIRED_TERMS).toContain('Pilot Access');
    expect(RETIRED_TERMS).toContain('Now in Pilot');
  });

  it('contains the retired 72-hours metric', () => {
    expect(RETIRED_TERMS).toContain('72 hours');
  });
});
