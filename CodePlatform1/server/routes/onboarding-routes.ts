import type { Express } from "express";
import { db } from "../db";
import {
  organizations,
  organizationOnboarding,
  playbookLibrary,
  strategicScenarios,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../replitAuth";
import { getUserId, getOrgIdForUser } from "./helpers";

export function registerOnboardingRoutes(app: Express): void {
// ONBOARDING JOURNEY API ROUTES
// ============================================

// Get or create onboarding session for current user
app.get('/api/onboarding-session', async (req: any, res) => {
  try {
    const userId = getUserId(req);
    
    // Check if user has an organization
    const userOrgs = await db.select().from(organizations).where(eq(organizations.ownerId, userId)).limit(1);
    
    if (userOrgs.length === 0) {
      // No org yet - return empty session to start fresh
      return res.json({ 
        session: null,
        isNewUser: true
      });
    }

    const org = userOrgs[0];
    
    // Check for existing onboarding progress
    const onboarding = await db.select().from(organizationOnboarding)
      .where(eq(organizationOnboarding.organizationId, org.id))
      .limit(1);

    if (onboarding.length === 0) {
      return res.json({
        session: null,
        organization: org,
        isNewUser: false
      });
    }

    res.json({
      session: onboarding[0],
      organization: org,
      isNewUser: false
    });
  } catch (error) {
    console.error("Error fetching onboarding session:", error);
    res.status(500).json({ message: "Failed to fetch onboarding session" });
  }
});

// Save onboarding journey progress
app.post('/api/onboarding/save', async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const { 
      step, 
      companyName, 
      industry, 
      employeeCount, 
      role,
      priorities,
      selectedPlaybooks,
      enabledSignals,
      successMetrics
    } = req.body;

    // Get or create organization
    let org = await db.select().from(organizations).where(eq(organizations.ownerId, userId)).limit(1);
    
    if (org.length === 0 && companyName) {
      // Create organization on first save
      const [newOrg] = await db.insert(organizations).values({
        name: companyName,
        description: `${companyName} - ${industry || 'Enterprise'} organization`,
        ownerId: userId,
        industry: industry,
        size: employeeCount,
        type: 'enterprise',
        domain: companyName.toLowerCase().replace(/\s+/g, '-'),
        onboardingCompleted: false,
      }).returning();
      org = [newOrg];
    }

    if (org.length === 0) {
      return res.status(400).json({ message: "Organization required" });
    }

    const orgId = org[0].id;

    // Update or create onboarding record
    const existingOnboarding = await db.select().from(organizationOnboarding)
      .where(eq(organizationOnboarding.organizationId, orgId))
      .limit(1);

    const onboardingData = {
      currentStep: step || 1,
      completedSteps: step ? Array.from({ length: step }, (_, i) => i + 1) : [],
      selectedPriorities: priorities || [],
      selectedPlaybooks: selectedPlaybooks || [],
      enabledSignalCategories: enabledSignals?.map((s: any) => s.id) || [],
      signalThresholds: enabledSignals?.reduce((acc: any, s: any) => {
        acc[s.id] = s.threshold;
        return acc;
      }, {}) || {},
      friTarget: successMetrics?.friTarget?.toString() || '84.4',
      lastActivityAt: new Date(),
    };

    if (existingOnboarding.length === 0) {
      await db.insert(organizationOnboarding).values({
        organizationId: orgId,
        ...onboardingData,
      });
    } else {
      await db.update(organizationOnboarding)
        .set(onboardingData)
        .where(eq(organizationOnboarding.organizationId, orgId));
    }

    // Update organization info if provided
    if (companyName || industry || employeeCount || role) {
      await db.update(organizations)
        .set({
          ...(companyName && { name: companyName }),
          ...(industry && { industry }),
          ...(employeeCount && { size: employeeCount }),
          updatedAt: new Date(),
        })
        .where(eq(organizations.id, orgId));
    }

    res.json({ success: true, organizationId: orgId });
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    res.status(500).json({ message: "Failed to save onboarding progress" });
  }
});

// Complete onboarding journey
app.post('/api/onboarding/commit', async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const { 
      organizationId,
      selectedPlaybooks,
      enabledSignals,
      successMetrics
    } = req.body;

    // Get organization
    const orgs = await db.select().from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (orgs.length === 0) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Mark onboarding as complete
    await db.update(organizations)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, organizationId));

    // Update onboarding record as complete
    await db.update(organizationOnboarding)
      .set({
        stage4Learn: true,
        onboardingCompletedAt: new Date(),
        lastActivityAt: new Date(),
      })
      .where(eq(organizationOnboarding.organizationId, organizationId));

    res.json({ 
      success: true, 
      message: "Onboarding completed successfully",
      organizationId
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
});

// Mark onboarding complete — uses session org (no body required)
app.post('/api/onboarding/complete', isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const orgId = await getOrgIdForUser(userId);
    if (!orgId) return res.status(404).json({ error: 'No organization found' });

    await db.update(organizations)
      .set({ onboardingCompleted: true, updatedAt: new Date() })
      .where(eq(organizations.id, orgId));

    res.json({ success: true });
  } catch (err: any) {
    console.error('Error completing onboarding:', err);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

// Seed sample data for a new org — a few signals and one pre-built playbook association
app.post('/api/onboarding/seed-demo-data', isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const orgId = await getOrgIdForUser(userId);
    if (!orgId) return res.status(404).json({ error: 'No organization found' });

    // Grab 3 playbooks from the global library
    const samplePlaybooks = await db.select().from(playbookLibrary).limit(3);

    // Create strategic scenarios linked to those playbooks for the user's org
    const scenarioInserts = samplePlaybooks.map((pb, i) => ({
      organizationId: orgId,
      createdBy: userId,
      name: pb.name,
      title: pb.name,
      description: pb.description || `Sample scenario for ${pb.name}`,
      type: pb.strategicCategory || 'competitive_threat',
      status: 'draft',
      impact: (i === 0 ? 'high' : 'medium') as 'high' | 'medium',
    }));

    const inserted = [];
    for (const scenario of scenarioInserts) {
      try {
        const [s] = await db.insert(strategicScenarios).values(scenario).returning();
        inserted.push(s);
      } catch {
        // skip if already exists
      }
    }

    console.log(`[Seed] Created ${inserted.length} sample scenarios for org ${orgId}`);
    res.json({ success: true, seeded: { scenarios: inserted.length } });
  } catch (err: any) {
    console.error('Error seeding demo data:', err);
    res.status(500).json({ error: 'Failed to seed demo data' });
  }
});

// ============================================
// END ONBOARDING JOURNEY API ROUTES
// ============================================

}
