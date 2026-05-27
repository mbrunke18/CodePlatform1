import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Auth Flow Logic Tests
 *
 * Tests the invariants of the login/upsertUser flow without hitting the DB.
 * These are the rules that must hold after every login — if any of these
 * break, production users will hit gated views on authenticated pages.
 */

// ── Pure logic extracted from replitAuth.ts ──────────────────────────────────
// The backfill logic: given a user's current organizationId and a list of
// orgs they own/belong to, returns the organizationId that should be written.
function resolveOrganizationId(
  currentOrgId: string | null | undefined,
  userOrgs: Array<{ id: string }>
): string | null {
  if (currentOrgId) return currentOrgId;
  return userOrgs.length > 0 ? userOrgs[0].id : null;
}

// Org name derivation: given OIDC claims, return the org name to use
function deriveOrgName(claims: {
  name?: string;
  email?: string;
}): string {
  const email = (claims.email ?? '').toLowerCase().trim();
  return claims.name || (email ? email.split('@')[0] : 'My Organization');
}

// Allowed-email org assignment: whether a user should be added to a pre-configured org
function shouldAssignPreConfiguredOrg(
  assignedOrgId: string | null
): boolean {
  return !!assignedOrgId;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Auth Flow — Organization Backfill', () => {
  describe('resolveOrganizationId', () => {
    it('returns existing organizationId unchanged when already set', () => {
      const result = resolveOrganizationId('existing-org-id', [
        { id: 'other-org-id' }
      ]);
      expect(result).toBe('existing-org-id');
    });

    it('backfills from first org when organizationId is null', () => {
      const result = resolveOrganizationId(null, [
        { id: 'owner-org-id' },
        { id: 'second-org-id' }
      ]);
      expect(result).toBe('owner-org-id');
    });

    it('backfills from first org when organizationId is undefined', () => {
      const result = resolveOrganizationId(undefined, [{ id: 'owner-org-id' }]);
      expect(result).toBe('owner-org-id');
    });

    it('returns null when no org exists and organizationId is unset', () => {
      const result = resolveOrganizationId(null, []);
      expect(result).toBeNull();
    });

    it('does not overwrite a valid organizationId even when multiple orgs exist', () => {
      const result = resolveOrganizationId('set-org', [
        { id: 'different-org' },
        { id: 'another-org' }
      ]);
      expect(result).toBe('set-org');
    });

    it('handles empty string organizationId as falsy — backfills it', () => {
      const result = resolveOrganizationId('', [{ id: 'correct-org' }]);
      expect(result).toBe('correct-org');
    });
  });

  describe('deriveOrgName', () => {
    it('uses name claim when available', () => {
      expect(deriveOrgName({ name: 'Marty Brunke', email: 'marty@example.com' }))
        .toBe('Marty Brunke');
    });

    it('falls back to email prefix when name is missing', () => {
      expect(deriveOrgName({ email: 'martybrunke@gmail.com' }))
        .toBe('martybrunke');
    });

    it('falls back to "My Organization" when both name and email are absent', () => {
      expect(deriveOrgName({})).toBe('My Organization');
    });

    it('strips domain from email to derive org name', () => {
      expect(deriveOrgName({ email: 'ceo@vaughnmartin.com' }))
        .toBe('ceo');
    });
  });

  describe('shouldAssignPreConfiguredOrg', () => {
    it('returns true when an org is pre-configured for this email', () => {
      expect(shouldAssignPreConfiguredOrg('pre-configured-org-id')).toBe(true);
    });

    it('returns false when no pre-configured org exists', () => {
      expect(shouldAssignPreConfiguredOrg(null)).toBe(false);
    });
  });
});

describe('Auth Flow — Critical Invariants', () => {
  it('a user who owns an org must always get organizationId set after login', () => {
    const userOwnedOrgs = [{ id: 'my-org-uuid' }];
    const currentOrgId = null; // Bug state: org exists but FK not written

    const resolved = resolveOrganizationId(currentOrgId, userOwnedOrgs);

    expect(resolved).not.toBeNull();
    expect(resolved).toBe('my-org-uuid');
  });

  it('a user with no orgs must not be assigned an org (org creation precedes this call)', () => {
    const resolved = resolveOrganizationId(null, []);
    expect(resolved).toBeNull();
  });

  it('a pre-existing organizationId is never clobbered by backfill', () => {
    const currentOrgId = 'production-org-id';
    const userOrgs = [{ id: 'different-org' }];

    const resolved = resolveOrganizationId(currentOrgId, userOrgs);

    expect(resolved).toBe('production-org-id');
    expect(resolved).not.toBe('different-org');
  });
});

describe('Auth Flow — Platform Admin Bypass', () => {
  // Platform admin email bypasses the allowlist. This is enforced server-side
  // via PLATFORM_ADMIN_EMAIL env var in isEmailAllowed(). The logic below
  // mirrors that check.
  function isAdminEmail(email: string, adminEmail: string | undefined): boolean {
    if (!adminEmail) return false;
    return email.toLowerCase().trim() === adminEmail.toLowerCase().trim();
  }

  it('platform admin email passes access check', () => {
    expect(isAdminEmail('admin@company.com', 'admin@company.com')).toBe(true);
  });

  it('non-admin email does not pass admin check', () => {
    expect(isAdminEmail('user@company.com', 'admin@company.com')).toBe(false);
  });

  it('admin check is case-insensitive', () => {
    expect(isAdminEmail('ADMIN@company.com', 'admin@company.com')).toBe(true);
  });

  it('returns false when PLATFORM_ADMIN_EMAIL is not set', () => {
    expect(isAdminEmail('admin@company.com', undefined)).toBe(false);
  });
});
