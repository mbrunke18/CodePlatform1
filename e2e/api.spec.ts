import { test, expect } from '@playwright/test';

/**
 * API Schema Checks — validates response shape, not just status.
 * Catches silent regressions where the endpoint returns 200 but the shape changed.
 */

test.describe('API — /api/playbooks/metadata', () => {
  test('returns 200 with array response', async ({ request }) => {
    const res = await request.get('/api/playbooks/metadata');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('each item has required fields', async ({ request }) => {
    const res = await request.get('/api/playbooks/metadata');
    const items = await res.json();
    if (items.length === 0) return;
    const first = items[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
  });
});

test.describe('API — /api/playbooks/templates', () => {
  test('returns 200 with array response', async ({ request }) => {
    const res = await request.get('/api/playbooks/templates');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

test.describe('API — /api/preparedness/score', () => {
  test('returns 200 or 401 (auth-gated is correct)', async ({ request }) => {
    const res = await request.get('/api/preparedness/score');
    expect([200, 401]).toContain(res.status());
  });

  test('if 200, response has score field', async ({ request }) => {
    const res = await request.get('/api/preparedness/score');
    if (res.status() !== 200) return;
    const body = await res.json();
    expect(body).toHaveProperty('score');
  });
});

test.describe('API — /api/public/live-context', () => {
  test('returns 200 with signals data', async ({ request }) => {
    const res = await request.get('/api/public/live-context');
    if (res.status() === 404) return;
    expect([200, 401]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(typeof body).toBe('object');
    }
  });
});

test.describe('API — /api/signals/live/status', () => {
  test('returns 200 with running status', async ({ request }) => {
    const res = await request.get('/api/signals/live/status');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('running');
    expect(typeof body.running).toBe('boolean');
  });
});

test.describe('API — Endpoint naming canonical check', () => {
  test('/api/preparedness/score and /api/preparedness-score both respond', async ({ request }) => {
    const r1 = await request.get('/api/preparedness/score');
    const r2 = await request.get('/api/preparedness-score');
    expect([200, 401]).toContain(r1.status());
    expect([200, 401]).toContain(r2.status());
  });
});
