import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './index';
import { testDb, clearDatabase, seedTestData, closeTestDatabase } from './test-db';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Ensure test database is clean
    await clearDatabase();
  });

  beforeEach(async () => {
    // Clean and seed data before each test
    await clearDatabase();
    await seedTestData();
  });

  afterAll(async () => {
    // Clean up and close connections
    await clearDatabase();
    await closeTestDatabase();
  });

  describe('GET /api/organizations', () => {
    it('should return all organizations with correct structure', async () => {
      const response = await request(app)
        .get('/api/organizations')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const org = response.body[0];
      expect(org).toHaveProperty('id');
      expect(org).toHaveProperty('name');
      expect(org).toHaveProperty('industry');
      expect(org).toHaveProperty('size');
      expect(org).toHaveProperty('headquarters');
      expect(org).toHaveProperty('adaptabilityScore');
    });

    it('should include seeded organizations in response', async () => {
      const response = await request(app)
        .get('/api/organizations')
        .expect(200);

      const orgNames = response.body.map((org: any) => org.name);
      expect(orgNames).toContain('Test Organization');
    });
  });

  describe('POST /api/scenarios', () => {
    it('should create a new strategic scenario and return 201', async () => {
      const newScenario = {
        title: 'Market Expansion Q4 2024',
        description: 'Strategic plan to expand into European markets',
        type: 'growth',
        category: 'market_expansion',
        organizationId: 'test-org-1',
        priority: 'high',
        confidence: 85,
        timeline: '6-12 months'
      };

      const response = await request(app)
        .post('/api/scenarios')
        .send(newScenario)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.title).toBe(newScenario.title);
      expect(response.body.type).toBe(newScenario.type);
      expect(response.body.category).toBe(newScenario.category);
      expect(response.body.confidence).toBe(newScenario.confidence);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidScenario = {
        description: 'Missing title and type',
        organizationId: 'test-org-1'
      };

      await request(app)
        .post('/api/scenarios')
        .send(invalidScenario)
        .expect(400);
    });

    it('should handle scenarios with actionable steps', async () => {
      const scenarioWithSteps = {
        title: 'Digital Transformation Initiative',
        description: 'Comprehensive digital modernization program',
        type: 'transformation',
        category: 'technology_integration',
        organizationId: 'test-org-1',
        priority: 'high',
        confidence: 90,
        timeline: '12-18 months',
        actionableSteps: [
          {
            description: 'Conduct technology audit',
            priority: 'high'
          },
          {
            description: 'Develop implementation roadmap',
            priority: 'medium'
          }
        ]
      };

      const response = await request(app)
        .post('/api/scenarios')
        .send(scenarioWithSteps)
        .expect(201);

      expect(response.body.title).toBe(scenarioWithSteps.title);
      expect(response.body.type).toBe(scenarioWithSteps.type);
    });
  });

  describe('GET /api/scenarios/:id', () => {
    it('should return a specific scenario by ID', async () => {
      // First create a scenario to retrieve
      const newScenario = {
        title: 'Test Scenario for Retrieval',
        description: 'A scenario to test GET by ID',
        type: 'risk_mitigation',
        category: 'operational_excellence',
        organizationId: 'test-org-1',
        priority: 'medium',
        confidence: 75,
        timeline: '3-6 months'
      };

      const createResponse = await request(app)
        .post('/api/scenarios')
        .send(newScenario)
        .expect(201);

      const scenarioId = createResponse.body.id;

      // Now retrieve it by ID
      const getResponse = await request(app)
        .get(`/api/scenarios/${scenarioId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getResponse.body.id).toBe(scenarioId);
      expect(getResponse.body.title).toBe(newScenario.title);
      expect(getResponse.body.type).toBe(newScenario.type);
    });

    it('should return 404 for non-existent scenario', async () => {
      await request(app)
        .get('/api/scenarios/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks array', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task and return 201', async () => {
      const newTask = {
        scenarioId: 'test-scenario-1',
        description: 'Complete market research analysis',
        priority: 'high',
        status: 'pending',
        businessValue: 25000
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.description).toBe(newTask.description);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.businessValue).toBe(newTask.businessValue);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid task data', async () => {
      const invalidTask = {
        scenarioId: 'test-scenario-1'
        // Missing required description
      };

      await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);
    });
  });

  describe('Health and Meta Endpoints', () => {
    it('should respond to health check', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });

    it('should serve API documentation', async () => {
      await request(app)
        .get('/api/docs')
        .expect(200);
    });
  });
});