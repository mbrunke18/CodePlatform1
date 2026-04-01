/**
 * Prospect Enrollment for Live Trigger Alerts
 *
 * When someone submits a Request Access or Pilot Application form, we enroll
 * them immediately as a stakeholder contact across all active monitoring orgs.
 * This means the very next trigger alert the platform detects will land in
 * their inbox — giving them the WOW moment before they even click their
 * magic link.
 *
 * They receive the standard trigger alert email with the unsubscribe footer,
 * so opting out is a single click.
 */

import { db } from '../db';
import { organizations, stakeholderContacts } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export async function enrollProspectForAlerts(prospect: {
  email: string;
  name: string;
  role: string;
  company: string;
}): Promise<void> {
  try {
    // Get every organization that exists in the DB, plus the built-in
    // 'system' org — the default monitoring org used when no org-specific
    // config is found. Enrolling in 'system' is the critical one that
    // ensures prospects receive the live trigger alerts.
    const dbOrgs = await db.select({ id: organizations.id }).from(organizations);
    const allOrgIds: string[] = ['system', ...dbOrgs.map(o => o.id)];

    let enrolled = 0;
    for (const orgId of allOrgIds) {
      const org = { id: orgId };
      try {
        // Check if this email is already registered in this org
        const existing = await db
          .select({ id: stakeholderContacts.id, isActive: stakeholderContacts.isActive })
          .from(stakeholderContacts)
          .where(
            and(
              eq(stakeholderContacts.organizationId, org.id as any),
              eq(stakeholderContacts.email, prospect.email)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Already exists — reactivate if they had previously unsubscribed
          if (!existing[0].isActive) {
            await db
              .update(stakeholderContacts)
              .set({ isActive: true })
              .where(eq(stakeholderContacts.id, existing[0].id));
            console.log(`[ProspectEnrollment] Reactivated ${prospect.email} in org ${org.id}`);
          } else {
            console.log(`[ProspectEnrollment] ${prospect.email} already enrolled in org ${org.id}`);
          }
          continue;
        }

        // Fresh enrollment — empty triggerDomains = receives ALL domain alerts
        await db.insert(stakeholderContacts).values({
          organizationId: org.id as any,
          role: prospect.role || 'Executive',
          name: prospect.name,
          email: prospect.email,
          isActive: true,
          triggerDomains: [], // receives every trigger regardless of domain
        });

        enrolled++;
        console.log(`✅ [ProspectEnrollment] Enrolled ${prospect.email} (${prospect.role} · ${prospect.company}) in org ${org.id} for live trigger alerts`);
      } catch (orgErr: any) {
        console.error(`[ProspectEnrollment] Failed to enroll in org ${org.id}:`, orgErr.message);
      }
    }

    if (enrolled > 0) {
      console.log(`✅ [ProspectEnrollment] ${prospect.email} will now receive live trigger alert emails across ${enrolled} org(s)`);
    }
  } catch (err: any) {
    // Non-fatal — enrollment failure must never break the request access flow
    console.error('[ProspectEnrollment] Enrollment failed (non-fatal):', err.message);
  }
}
