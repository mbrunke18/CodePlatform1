# M Strategic Execution Operating System - AWS Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Production Environment                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Route 53 (DNS)                                                  │
│      │                                                            │
│      ▼                                                            │
│  CloudFront (CDN)  ◄─── S3 (Static Assets)                       │
│      │                                                            │
│      ▼                                                            │
│  Application Load Balancer (ALB)                                 │
│      │                                                            │
│      ▼                                                            │
│  ECS Fargate Cluster (Container Orchestration)                   │
│      ├─ Task Definition (Node.js App)                            │
│      └─ Auto Scaling Group                                       │
│      │                                                            │
│      ├──► RDS PostgreSQL (Multi-AZ)                              │
│      ├──► ElastiCache Redis (for sessions/WebSocket)             │
│      └──► Secrets Manager (API keys, credentials)                │
│                                                                   │
│  CloudWatch (Monitoring & Logs)                                  │
│  CodePipeline (CI/CD)                                            │
│  CodeBuild (Build & Test)                                        │
│  ECR (Container Registry)                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### Prerequisites
- AWS Account with appropriate IAM permissions
- AWS CLI configured locally
- Docker installed locally
- Docker Hub or AWS ECR repository

### Phase 1: Prepare AWS Infrastructure

#### 1.1 Create RDS PostgreSQL Database

```bash
# Via AWS Console:
1. RDS > Create Database
2. Engine: PostgreSQL 16
3. Template: Production
4. DB Instance: db.t3.medium (or larger for prod)
5. Storage: 100 GB, SSD
6. Enable backup (30 days retention)
7. Enable Multi-AZ for high availability
8. Security group: Allow port 5432 from VPC
9. Subnet group: Create VPC-specific group
10. Copy the Endpoint (e.g., m-platform.xxxxx.us-east-1.rds.amazonaws.com)
```

**Note:** Save the master username, password, and endpoint!

#### 1.2 Create ElastiCache Redis Cluster

```bash
# Via AWS Console:
1. ElastiCache > Create Cluster
2. Engine: Redis 7.x
3. Cluster mode: Disabled
4. Node type: cache.t3.micro (or larger)
5. Number of nodes: 1 (or 3+ for production)
6. Automatic failover: Enable
7. Subnet group: Select same VPC as RDS
8. Security group: Allow port 6379 from VPC
9. Copy the Primary Endpoint (e.g., m-platform.xxxxx.ng.0001.use1.cache.amazonaws.com)
```

#### 1.3 Create Secrets Manager Secrets

```bash
# Via AWS CLI:
aws secretsmanager create-secret \
  --name m-platform/prod \
  --description "M Platform Production Secrets" \
  --secret-string '{
    "DATABASE_URL": "postgresql://m_user:PASSWORD@m-platform.xxxxx.us-east-1.rds.amazonaws.com:5432/m_platform",
    "REDIS_URL": "redis://m-platform.xxxxx.ng.0001.use1.cache.amazonaws.com:6379",
    "SESSION_SECRET": "your-very-long-random-secret-min-32-chars",
    "OPENAI_API_KEY": "sk-...",
    "COGNITO_CLIENT_ID": "...",
    "COGNITO_CLIENT_SECRET": "..."
  }'
```

#### 1.4 Set Up AWS Cognito (for Authentication)

```bash
# Via AWS Console:
1. Cognito > Create User Pool
2. Name: m-platform-users
3. Sign-in options: Email + Username
4. MFA: Optional (or Required)
5. Self-service sign-up: Enable
6. Create App Client:
   - Name: m-platform-web
   - Client type: Web
   - Auth flows: ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH
   - Allowed callback URLs: https://your-domain.com/auth/callback
   - Allowed sign-out URLs: https://your-domain.com

7. Create Domain: m-platform.auth.region.amazoncognito.com
```

### Phase 2: Containerize & Deploy to ECR

#### 2.1 Build and Push Docker Image

```bash
# From project root:

# 1. Create ECR Repository
aws ecr create-repository \
  --repository-name m-platform \
  --region us-east-1

# Get ECR URI (e.g., 123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform)

# 2. Authenticate Docker with ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# 3. Build Docker image locally (optional for testing)
docker-compose build

# Test locally:
docker-compose up
# Visit http://localhost:5000

# 4. Build and push to ECR
docker build -t m-platform:latest .
docker tag m-platform:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform:latest

# Tag with version for rollback capability
docker tag m-platform:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform:v1.0.0
```

### Phase 3: Set Up ECS Fargate

#### 3.1 Create ECS Cluster

```bash
# Via AWS CLI:
aws ecs create-cluster \
  --cluster-name m-platform \
  --region us-east-1
```

#### 3.2 Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/m-platform \
  --region us-east-1

aws logs put-retention-policy \
  --log-group-name /ecs/m-platform \
  --retention-in-days 30
```

#### 3.3 Create IAM Roles

```bash
# Task Execution Role (allows pulling images, writing logs)
aws iam create-role \
  --role-name ecsTaskExecutionRole-m-platform \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-m-platform \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-m-platform \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

# Task Role (allows app to access AWS services)
aws iam create-role \
  --role-name ecsTaskRole-m-platform \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

# Add policies as needed (S3, CloudWatch, etc.)
```

#### 3.4 Create ECS Task Definition

Save as `ecs-task-definition.json`:

```json
{
  "family": "m-platform",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "m-platform",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/m-platform:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/m-platform",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:m-platform/prod:DATABASE_URL::"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:m-platform/prod:REDIS_URL::"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:m-platform/prod:SESSION_SECRET::"
        },
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:m-platform/prod:OPENAI_API_KEY::"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ]
    }
  ],
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole-m-platform",
  "taskRoleArn": "arn:aws:iam::123456789:role/ecsTaskRole-m-platform"
}
```

Register task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json
```

### Phase 4: Set Up Load Balancer & Auto Scaling

#### 4.1 Create Application Load Balancer

```bash
# Via AWS Console:
1. EC2 > Load Balancers > Create Load Balancer
2. Application Load Balancer
3. Name: m-platform-alb
4. Scheme: Internet-facing
5. IP address type: IPv4
6. VPC: Select your VPC
7. Subnets: Select 2+ public subnets (multi-AZ)
8. Security group: Create with rules:
   - Inbound HTTP (80) from 0.0.0.0/0
   - Inbound HTTPS (443) from 0.0.0.0/0
   - Outbound all
9. Target group: Create
   - Name: m-platform-tg
   - Target type: IP
   - Protocol: HTTP
   - Port: 5000
   - Health check path: /health
   - Healthy threshold: 2
   - Unhealthy threshold: 2
10. Register targets: None (ECS will manage)
```

#### 4.2 Create ECS Service with Auto Scaling

```bash
# Create service
aws ecs create-service \
  --cluster m-platform \
  --service-name m-platform-service \
  --task-definition m-platform:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/m-platform-tg/abc123,containerName=m-platform,containerPort=5000 \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=DISABLED}" \
  --deployment-configuration maximumPercent=200,minimumHealthyPercent=100

# Set up Auto Scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/m-platform/m-platform-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Scale on CPU
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/m-platform/m-platform-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name m-platform-cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration "TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization},ScaleOutCooldown=300,ScaleInCooldown=300"
```

### Phase 5: Set Up CI/CD Pipeline

#### 5.1 Create CodePipeline

```bash
# Via AWS Console:
1. CodePipeline > Create pipeline
2. Pipeline name: m-platform-pipeline
3. Source: GitHub / CodeCommit
   - Connect to repository
   - Select branch: main
4. Build: CodeBuild
   - Create new build project
   - Environment: Managed image, Ubuntu
   - Runtime: Standard
   - Image: aws/codebuild/standard:7.0
5. Deploy: ECS
   - Cluster: m-platform
   - Service: m-platform-service
```

#### 5.2 Create buildspec.yml

Save as `buildspec.yml`:

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/m-platform
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}

  build:
    commands:
      - echo Building the Docker image on `date`
      - docker build -t $REPOSITORY_URI:$IMAGE_TAG .
      - docker tag $REPOSITORY_URI:$IMAGE_TAG $REPOSITORY_URI:latest
      - echo Running tests...
      - docker run --rm $REPOSITORY_URI:$IMAGE_TAG npm run check

  post_build:
    commands:
      - echo Pushing the Docker image to ECR on `date`
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Writing image definitions file...
      - printf '[{"name":"m-platform","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files: imagedefinitions.json
```

### Phase 6: SSL/TLS & Domain

#### 6.1 Request SSL Certificate

```bash
aws acm request-certificate \
  --domain-name m-platform.com \
  --subject-alternative-names www.m-platform.com \
  --validation-method DNS \
  --region us-east-1
```

Verify domain ownership via DNS records.

#### 6.2 Update ALB with HTTPS

```bash
# Add HTTPS listener to ALB (via console):
1. Load Balancer > Listeners
2. Add listener: HTTPS (443)
3. Select SSL certificate from ACM
4. Forward to target group: m-platform-tg
```

#### 6.3 Configure Route 53

```bash
# Create Route 53 hosted zone (if not existing)
aws route53 create-hosted-zone \
  --name m-platform.com \
  --caller-reference $(date +%s)

# Create alias record pointing to ALB
# Via console:
1. Route 53 > Hosted Zones > m-platform.com
2. Create record:
   - Name: m-platform.com (or www.m-platform.com)
   - Type: A
   - Alias: Yes
   - Alias target: Select ALB
   - Routing policy: Simple
```

### Phase 7: Monitoring & Logging

#### 7.1 CloudWatch Monitoring

Dashboards:
```bash
# Create dashboard via console:
1. CloudWatch > Dashboards > Create
2. Add widgets:
   - ECS Service CPU/Memory
   - RDS Database Metrics
   - ALB Request Count/Latency
   - Application Logs (from /ecs/m-platform)
```

Alarms:
```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name m-platform-high-cpu \
  --alarm-description "Alert when ECS CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789:ops-alerts
```

### Phase 8: Database Migrations

```bash
# SSH into ECS task or run one-off task for migrations
aws ecs run-task \
  --cluster m-platform \
  --task-definition m-platform:1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345]}" \
  --overrides '{"containerOverrides":[{"name":"m-platform","command":["npx","drizzle-kit","push"]}]}'
```

## Estimated Monthly Costs (Production)

| Service | Instance | Size | Cost/Month |
|---------|----------|------|-----------|
| ECS Fargate | 2 tasks | 512 CPU, 1GB RAM | $100-150 |
| RDS PostgreSQL | db.t3.medium | 2 vCPU, 4GB RAM | $150-200 |
| ElastiCache Redis | cache.t3.micro | 1 node | $25 |
| ALB | 1 load balancer | - | $20 |
| NAT Gateway | - | - | $30 |
| CloudFront | CDN | Usage-based | $10-50 |
| S3 | Static assets | 10GB | $0.50 |
| Secrets Manager | - | Per secret | $1 |
| **TOTAL** | | | **$336-466/month** |

*Costs scale with traffic, storage, and data transfer.*

## Troubleshooting

### Task won't start
```bash
# Check logs
aws logs tail /ecs/m-platform --follow

# Check task status
aws ecs describe-tasks --cluster m-platform --tasks <task-arn>
```

### Database connection issues
```bash
# Verify security group allows traffic from ECS
aws ec2 describe-security-groups --group-ids sg-xxxxxx

# Test connection (from EC2 bastion):
psql -h m-platform.xxxxx.rds.amazonaws.com -U m_user -d m_platform
```

### Scaling not working
```bash
# Check metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=m-platform-service Name=ClusterName,Value=m-platform \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average
```

## Production Checklist

- [ ] RDS Multi-AZ enabled with daily backups
- [ ] ElastiCache set up with failover
- [ ] Secrets Manager populated with all keys
- [ ] SSL/TLS certificate installed and valid
- [ ] Route 53 DNS configured
- [ ] CloudWatch dashboards and alarms set up
- [ ] CI/CD pipeline tested and working
- [ ] Database migrations applied
- [ ] Load testing completed (target: 1000+ concurrent users)
- [ ] Security groups properly configured (least privilege)
- [ ] VPC endpoints set up for private communication
- [ ] Backup and disaster recovery plan documented
- [ ] On-call alerting configured
- [ ] Log retention policies set
- [ ] WAF rules configured (optional but recommended)

## Next Steps

1. **Migrate from Replit OIDC to AWS Cognito** (optional but recommended)
2. **Add WAF for DDoS protection**
3. **Implement blue/green deployments** for zero-downtime updates
4. **Set up Application Performance Monitoring (APM)** with X-Ray
5. **Configure backup strategy** with AWS Backup
6. **Create runbooks** for common operational tasks
