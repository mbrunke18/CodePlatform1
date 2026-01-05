import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'M Strategic Intelligence Platform API',
      version: '2.0.0',
      description: `
        M is a comprehensive Strategic Intelligence Platform that enables organizations to:
        
        - **Strategic Planning**: Manage complex scenarios and strategic initiatives
        - **Crisis Response**: Execute automated crisis response protocols with 15+ templates
        - **AI Intelligence**: Leverage 5 dedicated AI modules for organizational insights
        - **Real-time Collaboration**: Enable collaborative decision-making with WebSocket support
        - **Predictive Analytics**: Access advanced business intelligence and forecasting
        
        ## Key Features
        - 🎯 Executive-grade scenario management with automated triggers
        - ⚡ Real-time crisis response with emergency protocols
        - 🧠 AI-powered insights via Pulse, Flux, Prism, Echo, and Nova modules
        - 📊 Comprehensive analytics and performance tracking
        - 🔒 Enterprise security with audit logging and access controls
        
        ## Authentication
        This API uses Replit's OpenID Connect (OIDC) authentication for secure access.
      `,
      contact: {
        name: 'M Platform Team',
        email: 'platform@m-exec.ai'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://api.m-exec.ai' : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        }
      },
      schemas: {
        Organization: {
          type: 'object',
          required: ['id', 'name'],
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique organization identifier' },
            name: { type: 'string', description: 'Organization name' },
            description: { type: 'string', description: 'Organization description' },
            industry: { type: 'string', description: 'Industry sector' },
            size: { type: 'string', enum: ['startup', 'small', 'medium', 'large', 'enterprise'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        StrategicScenario: {
          type: 'object',
          required: ['id', 'name', 'organizationId', 'status'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', description: 'Scenario name' },
            description: { type: 'string', description: 'Scenario description' },
            organizationId: { type: 'string', format: 'uuid' },
            status: { 
              type: 'string', 
              enum: ['draft', 'active', 'completed', 'archived'],
              description: 'Current scenario status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Scenario priority level'
            },
            category: { type: 'string', description: 'Scenario category' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          required: ['id', 'title', 'status'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', description: 'Task description' },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'completed', 'cancelled'],
              description: 'Task status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Task priority'
            },
            assigneeId: { type: 'string', description: 'Assigned user ID' },
            scenarioId: { type: 'string', format: 'uuid', description: 'Associated scenario ID' },
            dueDate: { type: 'string', format: 'date-time', description: 'Task due date' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', description: 'User who performed the action' },
            action: { type: 'string', description: 'Description of the action taken' },
            resourceType: {
              type: 'string',
              enum: ['scenario', 'task', 'organization', 'user'],
              description: 'Type of resource affected'
            },
            resourceId: { type: 'string', description: 'ID of affected resource' },
            timestamp: { type: 'string', format: 'date-time' },
            metadata: { type: 'object', description: 'Additional activity metadata' }
          }
        },
        CrisisTemplate: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Template identifier' },
            name: { type: 'string', description: 'Crisis template name' },
            category: { 
              type: 'string',
              enum: ['supply-chain', 'cybersecurity', 'financial', 'operational', 'regulatory', 'reputation'],
              description: 'Crisis category'
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Default severity level'
            },
            description: { type: 'string', description: 'Template description' },
            activationTime: { type: 'string', description: 'Expected activation timeframe' },
            stakeholders: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Key stakeholders to involve'
            },
            resources: {
              type: 'array',
              items: { type: 'string' },
              description: 'Required resources and capabilities'
            }
          }
        },
        AIIntelligenceModule: {
          type: 'object',
          properties: {
            module: {
              type: 'string',
              enum: ['pulse', 'flux', 'prism', 'echo', 'nova'],
              description: 'AI Intelligence module type'
            },
            metrics: { type: 'object', description: 'Module-specific metrics and KPIs' },
            insights: {
              type: 'array',
              items: { type: 'object' },
              description: 'Generated insights and recommendations'
            },
            status: {
              type: 'string',
              enum: ['active', 'learning', 'analyzing', 'idle'],
              description: 'Module operational status'
            },
            lastUpdate: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string', description: 'Error message' },
                status: { type: 'integer', description: 'HTTP status code' },
                timestamp: { type: 'string', format: 'date-time' },
                details: { type: 'string', description: 'Additional error details (dev only)' }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] },
      { sessionAuth: [] }
    ]
  },
  apis: ['./server/routes.ts', './server/api/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  // Serve Swagger UI at /api/docs
  app.use('/api/docs', swaggerUi.serve);
  app.get('/api/docs', swaggerUi.setup(specs, {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #2563eb; }
    `,
    customSiteTitle: 'M API Documentation',
    customfavIcon: '/favicon.ico'
  }));

  // Serve OpenAPI spec as JSON
  app.get('/api/openapi.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export { specs };