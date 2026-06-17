/**
 * One-time setup: Create the VaughnMartin organization and register
 * all founding team emails so they land in the right org on first login.
 * Run with: npx tsx scripts/seed-vaughnmartin-org.ts
 */

import { db } from "../server/db";
import { organizations, allowedEmails } from "../shared/schema";
import { eq } from "drizzle-orm";

const TEAM = [
  { email: "martinbrunke@yahoo.com",  role: "Functional Lead",        note: "Functional Lead — VaughnMartin founding team" },
  { email: "martybrunke@gmail.com",   role: "Executive Authorizer",   note: "Executive Authorizer — Founder (personal Gmail)" },
  { email: "mbrunke@vaughnmartin.com",role: "Executive Authorizer",   note: "Executive Authorizer — Founder (business email)" },
  { email: "ssusanapt@aol.com",       role: "PMO Director",           note: "PMO Director — VaughnMartin founding team" },
  { email: "stoof@metrocast.net",     role: "PMO Director",           note: "PMO Director — VaughnMartin founding team" },
  { email: "lbelliveau1212@gmail.com",role: "Functional Lead",        note: "Functional Lead — VaughnMartin founding team" },
];

async function main() {
  console.log("── VaughnMartin Org Setup ──────────────────────────────────");

  // ── 1. Find or create the VaughnMartin organization ────────────────────────
  const existing = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, "VaughnMartin"))
    .limit(1);

  let orgId: string;

  if (existing.length > 0) {
    orgId = existing[0].id;
    console.log(`✓ Organization already exists — ID: ${orgId}`);
  } else {
    const [created] = await db
      .insert(organizations)
      .values({
        name: "VaughnMartin",
        description: "VaughnMartin Readiness OS — the company that built the platform, running on the platform.",
        ownerId: "vm-founder-2026",
        domain: "vaughnmartin.com",
        type: "enterprise",
        industry: "Technology",
        headquarters: "United States",
        onboardingCompleted: true,
        subscriptionTier: "enterprise",
        status: "Active",
        settings: {
          readinessOSLive: true,
          foundingPartner: true,
          internalOrg: true,
        },
      })
      .returning();
    orgId = created.id;
    console.log(`✓ Created VaughnMartin organization — ID: ${orgId}`);
  }

  // ── 2. Register each team email in the allowlist ────────────────────────────
  let added = 0;
  let skipped = 0;

  for (const member of TEAM) {
    const normalizedEmail = member.email.toLowerCase().trim();

    const alreadyExists = await db
      .select()
      .from(allowedEmails)
      .where(eq(allowedEmails.email, normalizedEmail))
      .limit(1);

    if (alreadyExists.length > 0) {
      // Update the organizationId in case it wasn't set
      await db
        .update(allowedEmails)
        .set({ organizationId: orgId, note: member.note })
        .where(eq(allowedEmails.email, normalizedEmail));
      console.log(`↺  Updated  ${normalizedEmail}  (${member.role})`);
      skipped++;
    } else {
      await db.insert(allowedEmails).values({
        email: normalizedEmail,
        organizationId: orgId,
        note: member.note,
      });
      console.log(`+  Added    ${normalizedEmail}  (${member.role})`);
      added++;
    }
  }

  console.log("");
  console.log(`── Done ────────────────────────────────────────────────────`);
  console.log(`   Org ID : ${orgId}`);
  console.log(`   Added  : ${added} email(s)`);
  console.log(`   Updated: ${skipped} email(s)`);
  console.log(`   Total  : ${TEAM.length} team members registered`);
  console.log("");
  console.log("Each person can now sign in via Replit and will land directly");
  console.log("in the VaughnMartin organization — no setup required.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
