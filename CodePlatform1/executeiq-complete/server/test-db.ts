import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema.js';

// Test database configuration - SAFETY: Only allow dedicated test databases
const getTestDatabaseUrl = () => {
  // Enforce NODE_ENV=test for safety
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Test database utilities can only be used when NODE_ENV=test');
  }
  
  const testDbUrl = process.env.TEST_DATABASE_URL;
  if (!testDbUrl) {
    throw new Error('TEST_DATABASE_URL must be explicitly set for testing - will not fallback to production DATABASE_URL');
  }
  
  // Additional safety: ensure database name contains '_test'
  if (!testDbUrl.includes('_test')) {
    throw new Error('Test database URL must contain "_test" in the database name for safety');
  }
  
  return testDbUrl;
};

const connectionString = getTestDatabaseUrl();
const client = postgres(connectionString);
export const testDb = drizzle(client, { schema });

// Test database utilities
export async function clearDatabase() {
  const tables = [
    'activities',
    'decision_outcomes', 
    'evidence',
    'recommendations',
    'insights',
    'kpis',
    'initiatives',
    'risks',
    'executive_insights',
    'strategic_alerts',
    'executive_briefings',
    'war_room_updates',
    'war_room_sessions',
    'intelligence_reports',
    'nova_innovations',
    'echo_cultural_metrics',
    'prism_insights',
    'flux_adaptations',
    'pulse_metrics',
    'projects',
    'tasks',
    'strategic_scenarios',
    'business_units',
    'organizations',
    'users',
    'role_permissions',
    'permissions',
    'roles'
  ];

  // Clear tables in reverse dependency order
  for (const table of tables) {
    try {
      await testDb.execute(postgres.unsafe(`TRUNCATE TABLE ${table} CASCADE`));
    } catch (error) {
      // Ignore errors for tables that might not exist
      console.warn(`Warning: Could not truncate table ${table}:`, error);
    }
  }
}

export async function seedTestData() {
  // Basic test organization
  const [testOrg] = await testDb.insert(schema.organizations).values({
    id: 'test-org-1',
    name: 'Test Organization',
    description: 'Organization for testing purposes',
    ownerId: 'test-user',
    domain: 'test.com',
    type: 'enterprise',
    size: 1000,
    industry: 'Technology',
    headquarters: 'Test City, TC',
    adaptabilityScore: 85.5,
    onboardingCompleted: true,
    subscriptionTier: 'enterprise',
    status: 'active'
  }).returning();

  // Basic test user  
  const [testUser] = await testDb.insert(schema.users).values({
    id: 'test-user',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    department: 'Technology',
    team: 'Engineering',
    title: 'Software Engineer',
    organizationId: testOrg.id,
    isActive: true,
    hasCompletedOnboarding: true
  }).returning();

  // Basic test scenario
  const [testScenario] = await testDb.insert(schema.strategicScenarios).values({
    id: 'test-scenario-1',
    title: 'Test Strategic Scenario',
    description: 'A scenario for testing purposes',
    type: 'growth',
    category: 'market_expansion',
    organizationId: testOrg.id,
    createdBy: testUser.id,
    priority: 'medium',
    confidence: 75,
    timeline: '3-6 months',
    isActive: true
  }).returning();

  return {
    organization: testOrg,
    user: testUser,
    scenario: testScenario
  };
}

export async function closeTestDatabase() {
  try {
    await client.end();
  } catch (error) {
    console.warn('Warning: Error closing test database connection:', error);
  }
}