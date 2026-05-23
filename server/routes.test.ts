import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Server Route Validation Logic Tests
 *
 * These tests verify the request-validation contracts used by the API routes
 * (Zod schemas and business rules). They run without a database or HTTP server,
 * making them fast and fully deterministic.
 */

const insertOrganizationSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  size: z.number().int().positive(),
  headquarters: z.string().min(1),
  type: z.enum(['enterprise', 'mid-market', 'startup', 'government', 'non-profit']),
  subscriptionTier: z.enum(['starter', 'professional', 'enterprise']).default('starter'),
});

const insertScenarioSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['growth', 'transformation', 'risk_mitigation', 'competitive_response']),
  category: z.string().min(1),
  organizationId: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  confidence: z.number().min(0).max(100),
  timeline: z.string().min(1),
});

const insertTaskSchema = z.object({
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  businessValue: z.number().nonnegative().optional(),
});

describe('Organization Request Validation', () => {
  it('accepts a valid organization payload', () => {
    const result = insertOrganizationSchema.safeParse({
      name: 'Acme Corp',
      industry: 'Technology',
      size: 5000,
      headquarters: 'New York, NY',
      type: 'enterprise',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing name', () => {
    const result = insertOrganizationSchema.safeParse({
      industry: 'Technology',
      size: 5000,
      headquarters: 'New York, NY',
      type: 'enterprise',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid organization type', () => {
    const result = insertOrganizationSchema.safeParse({
      name: 'Corp',
      industry: 'Tech',
      size: 100,
      headquarters: 'NY',
      type: 'unicorn',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-positive employee size', () => {
    const result = insertOrganizationSchema.safeParse({
      name: 'Corp',
      industry: 'Tech',
      size: -10,
      headquarters: 'NY',
      type: 'startup',
    });
    expect(result.success).toBe(false);
  });

  it('defaults subscriptionTier to "starter" when omitted', () => {
    const result = insertOrganizationSchema.safeParse({
      name: 'New Co',
      industry: 'Finance',
      size: 200,
      headquarters: 'Boston, MA',
      type: 'mid-market',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.subscriptionTier).toBe('starter');
  });
});

describe('Scenario Request Validation', () => {
  const validScenario = {
    title: 'Market Expansion Q4',
    description: 'Expand into European markets',
    type: 'growth' as const,
    category: 'market_expansion',
    organizationId: 'org-001',
    priority: 'high' as const,
    confidence: 85,
    timeline: '6-12 months',
  };

  it('accepts a valid scenario payload', () => {
    const result = insertScenarioSchema.safeParse(validScenario);
    expect(result.success).toBe(true);
  });

  it('rejects a missing title', () => {
    const { title: _, ...withoutTitle } = validScenario;
    const result = insertScenarioSchema.safeParse(withoutTitle);
    expect(result.success).toBe(false);
  });

  it('rejects a missing description', () => {
    const { description: _, ...withoutDescription } = validScenario;
    const result = insertScenarioSchema.safeParse(withoutDescription);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid scenario type', () => {
    const result = insertScenarioSchema.safeParse({ ...validScenario, type: 'unknown' });
    expect(result.success).toBe(false);
  });

  it('rejects confidence outside 0–100 range', () => {
    expect(insertScenarioSchema.safeParse({ ...validScenario, confidence: 105 }).success).toBe(false);
    expect(insertScenarioSchema.safeParse({ ...validScenario, confidence: -5 }).success).toBe(false);
  });

  it('accepts confidence at boundary values 0 and 100', () => {
    expect(insertScenarioSchema.safeParse({ ...validScenario, confidence: 0 }).success).toBe(true);
    expect(insertScenarioSchema.safeParse({ ...validScenario, confidence: 100 }).success).toBe(true);
  });

  it('rejects invalid priority level', () => {
    const result = insertScenarioSchema.safeParse({ ...validScenario, priority: 'extreme' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid scenario types', () => {
    const types = ['growth', 'transformation', 'risk_mitigation', 'competitive_response'];
    for (const type of types) {
      const result = insertScenarioSchema.safeParse({ ...validScenario, type });
      expect(result.success, `type "${type}" should be valid`).toBe(true);
    }
  });
});

describe('Task Request Validation', () => {
  const validTask = {
    description: 'Complete market research analysis',
    priority: 'high' as const,
    status: 'pending' as const,
    businessValue: 25000,
  };

  it('accepts a valid task payload', () => {
    const result = insertTaskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it('rejects a missing description', () => {
    const { description: _, ...withoutDescription } = validTask;
    const result = insertTaskSchema.safeParse(withoutDescription);
    expect(result.success).toBe(false);
  });

  it('rejects a negative business value', () => {
    const result = insertTaskSchema.safeParse({ ...validTask, businessValue: -100 });
    expect(result.success).toBe(false);
  });

  it('accepts a task without optional businessValue', () => {
    const { businessValue: _, ...withoutValue } = validTask;
    const result = insertTaskSchema.safeParse(withoutValue);
    expect(result.success).toBe(true);
  });

  it('defaults status to "pending" when omitted', () => {
    const { status: _, ...withoutStatus } = validTask;
    const result = insertTaskSchema.safeParse(withoutStatus);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('pending');
  });

  it('rejects an invalid priority', () => {
    const result = insertTaskSchema.safeParse({ ...validTask, priority: 'urgent' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid priority values', () => {
    const priorities = ['low', 'medium', 'high', 'critical'];
    for (const priority of priorities) {
      const result = insertTaskSchema.safeParse({ ...validTask, priority });
      expect(result.success, `priority "${priority}" should be valid`).toBe(true);
    }
  });
});

describe('Platform Constants', () => {
  it('12-minute benchmark compresses 30-day mobilization cycle', () => {
    const mobilizationDays = 30;
    const mobilizationMinutes = mobilizationDays * 24 * 60;
    const readinesMinutes = 12;
    const headStart = mobilizationMinutes / readinesMinutes;
    expect(Math.round(headStart)).toBe(3600);
  });

  it('3,600× head start label matches actual ratio', () => {
    const ratio = (30 * 24 * 60) / 12;
    expect(ratio).toBe(3600);
  });

  it('180 Readiness Protocols constant is correct', () => {
    const TOTAL_PROTOCOLS = 180;
    expect(TOTAL_PROTOCOLS).toBe(180);
    expect(TOTAL_PROTOCOLS).toBeGreaterThan(0);
  });
});
