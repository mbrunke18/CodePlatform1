import { describe, it, expect, vi } from 'vitest';
import { conditionalAuth, isPublicRoute } from '../authConfig';

/**
 * Public Lead-Capture Routes — Anonymous Access Regression Guard
 *
 * Incident: 3 lead-capture endpoints used by public sales tools
 * (ROI Calculator, 12-Minute Test Drive, Situation Scanner) were silently
 * 401ing every anonymous prospect for months. The bug was invisible because:
 *   - Business-logic unit tests never send a request through the real
 *     `conditionalAuth` middleware, so a missing allowlist entry can't fail
 *     a test.
 *   - Manual QA happens in an authenticated session, which always bypasses
 *     `conditionalAuth` regardless of the allowlist — the one population
 *     that actually triggers the bug (anonymous visitors) was never tested.
 *   - The frontend fails quietly (a caught 401 just flips an "error" state)
 *     instead of crashing loudly.
 *
 * This test exercises the actual production `conditionalAuth` middleware
 * (not a mock) with a request that has no `req.user`, exactly matching an
 * anonymous prospect's request. Any new public-facing lead-capture or
 * conversion endpoint should be added to CRITICAL_PUBLIC_LEAD_CAPTURE_ROUTES
 * below so it's covered by this guard.
 */

const CRITICAL_PUBLIC_LEAD_CAPTURE_ROUTES = [
  '/api/test-drive/email-summary',
  '/api/situation-scanner/lead',
  '/api/roi-calculator/email-report',
  '/api/investor-access',
  '/api/founding-partner/apply',
  '/api/pilot/apply',
  '/api/trial/request',
  '/api/demo-access',
  '/api/peer-reviews',
];

function buildAnonymousRequest(path: string) {
  const req: any = { originalUrl: path, url: path, user: undefined };
  const jsonMock = vi.fn();
  const statusMock = vi.fn(() => ({ json: jsonMock }));
  const res: any = { status: statusMock };
  const next = vi.fn();
  return { req, res, next, statusMock, jsonMock };
}

describe('Public lead-capture routes — anonymous access regression guard', () => {
  it.each(CRITICAL_PUBLIC_LEAD_CAPTURE_ROUTES)(
    '%s is reachable by an anonymous (unauthenticated) request',
    (path) => {
      expect(isPublicRoute(path)).toBe(true);

      const { req, res, next, statusMock } = buildAnonymousRequest(path);
      conditionalAuth(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    }
  );

  it('sanity check: a route NOT on the allowlist still requires auth for an anonymous request', () => {
    // Synthetic path guaranteed not to match any entry (exact or :param pattern)
    // in PUBLIC_ROUTES, so this proves the guard above is actually discriminating
    // public vs. protected rather than trivially passing everything.
    const protectedPath = '/api/__not-a-real-route__/should-require-auth';
    expect(isPublicRoute(protectedPath)).toBe(false);

    const { req, res, next, statusMock, jsonMock } = buildAnonymousRequest(protectedPath);
    conditionalAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Authentication required' })
    );
  });
});
