# M Platform - AWS Deployment Quick Start (30 Minutes to Production)

## Prerequisites
Before starting, you need:
- AWS Account (with billing enabled)
- AWS CLI installed locally (`aws --version` to check)
- Docker installed locally (`docker --version` to check)
- Git repository with code pushed to GitHub/CodeCommit
- ~$20-30 for initial setup costs

---

## PHASE 1: Prepare AWS Account (5 minutes)

### Step 1.1: Get AWS Account ID
```bash
aws sts get-caller-identity --query Account --output text
# Copy this number - you'll need it: 123456789012
```

### Step 1.2: Create S3 Bucket for Deployments
```bash
# Replace YOUR-BUCKET-NAME with something unique
aws s3 mb s3://YOUR-BUCKET-NAME-m-platform-deployment

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket YOUR-BUCKET-NAME-m-platform-deployment \
  --versioning-configuration Status=Enabled
```

### Step 1.3: Set Region Variable (Important!)
```bash
# Export these variables - use them throughout
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=123456789012  # YOUR account ID from Step 1.1
```

---

## PHASE 2: Create Database & Cache (10 minutes)

### Step 2.1: Create RDS PostgreSQL Database

**Via AWS Console:**
1. Go to **RDS > Create Database**
2. Choose **PostgreSQL** version 16.1
3. **Template**: Production
4. **DB Instance Identifier**: `m-platform-db`
5. **Master username**: `postgres`
6. **Master password**: Create strong password (save this!)
7. **Instance class**: `db.t3.micro` (dev) or `db.t3.small` (prod)
8. **Storage**: 20 GB, SSD
9. **Backup retention**: 7 days
10. **Multi-AZ**: Enable
11. **Scroll down** > **Additional configuration**
    - Initial database name: `m_platform`
12. Click **Create Database**

**Wait 5-10 minutes for database to be ready**

Once ready, copy the **Endpoint** (looks like: `m-platform-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 2.2: Create ElastiCache Redis
```bash
# Create security group for Redis
aws ec2 create-security-group \
  --group-name m-platform-redis-sg \
  --description "Security group for M Platform Redis" \
  --region $AWS_REGION \
  --query GroupId --output text
# Save the GroupId: sg-xxxxx

# Create Redis cluster (via console is easier):
```

**Via AWS Console:**
1. Go to **ElastiCache > Redis > Create**
2. **Cluster name**: `m-platform-redis`
3. **Engine version**: 7.0
4. **Node type**: `cache.t3.micro`
5. **Number of nodes**: 1
6. Click **Create**

**Wait 5 minutes for Redis to be ready**

Once ready, copy the **Primary Endpoint** (looks like: `m-platform-redis.xxxxx.ng.0001.use1.cache.amazonaws.com:6379`)

---

## PHASE 3: Set Up Secrets (5 minutes)

### Step 3.1: Create Secrets in AWS Secrets Manager

**Replace these values:**
- `YOUR_DB_ENDPOINT` = RDS endpoint from Step 2.1
- `YOUR_REDIS_ENDPOINT` = Redis endpoint from Step 2.2
- `YOUR_SESSION_SECRET` = Generate random string (e.g., `$(openssl rand -base64 32)`)
- `YOUR_OPENAI_KEY` = Your OpenAI API key

```bash
aws secretsmanager create-secret \
  --name m-platform/prod \
  --description "M Platform Production Secrets" \
  --secret-string '{
    "DATABASE_URL": "postgresql://postgres:YOUR_PASSWORD@YOUR_DB_ENDPOINT:5432/m_platform",
    "REDIS_URL": "redis://YOUR_REDIS_ENDPOINT",
    "SESSION_SECRET": "YOUR_SESSION_SECRET",
    "OPENAI_API_KEY": "YOUR_OPENAI_KEY",
    "NODE_ENV": "production"
  }' \
  --region $AWS_REGION
```

**Save the Secret ARN** (looks like: `arn:aws:secretsmanager:us-east-1:123456789:secret:m-platform/prod-xxxxx`)

---

## PHASE 4: Build & Push Docker Image (5 minutes)

### Step 4.1: Build Docker Image Locally
```bash
# From project root
docker build -t m-platform:latest .

# Verify it built
docker images | grep m-platform
```

### Step 4.2: Create ECR Repository
```bash
aws ecr create-repository \
  --repository-name m-platform \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true

# Get the URI
export ECR_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/m-platform
echo $ECR_URI
```

### Step 4.3: Login & Push to ECR
```bash
# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_URI

# Tag image
docker tag m-platform:latest $ECR_URI:latest
docker tag m-platform:latest $ECR_URI:v1.0.0

# Push
docker push $ECR_URI:latest
docker push $ECR_URI:v1.0.0

echo "✓ Image pushed to: $ECR_URI:latest"
```

---

## PHASE 5: Create ECS Cluster & Service (5 minutes)

### Step 5.1: Create ECS Cluster
```bash
aws ecs create-cluster \
  --cluster-name m-platform \
  --region $AWS_REGION
```

### Step 5.2: Create CloudWatch Log Group
```bash
aws logs create-log-group \
  --log-group-name /ecs/m-platform \
  --region $AWS_REGION

aws logs put-retention-policy \
  --log-group-name /ecs/m-platform \
  --retention-in-days 30
```

### Step 5.3: Create IAM Role for ECS

**Save this to `ecs-task-role.json`:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
# Execution role (for ECR access)
aws iam create-role \
  --role-name ecsTaskExecutionRole-m-platform \
  --assume-role-policy-document file://ecs-task-role.json \
  --region $AWS_REGION

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-m-platform \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole-m-platform \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

### Step 5.4: Register ECS Task Definition

**Save this to `task-definition.json` and update YOUR_VALUES:**

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
          "valueFrom": "YOUR_SECRET_ARN:DATABASE_URL::"
        },
        {
          "name": "REDIS_URL",
          "valueFrom": "YOUR_SECRET_ARN:REDIS_URL::"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "YOUR_SECRET_ARN:SESSION_SECRET::"
        },
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "YOUR_SECRET_ARN:OPENAI_API_KEY::"
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
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole-m-platform"
}
```

```bash
# Register task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region $AWS_REGION
```

### Step 5.5: Create Load Balancer (Via Console - 2 minutes)

1. Go to **EC2 > Load Balancers > Create Load Balancer**
2. Choose **Application Load Balancer**
3. **Name**: `m-platform-alb`
4. **Scheme**: Internet-facing
5. **VPC**: Select default
6. **Subnets**: Select 2 public subnets
7. **Security Group**: Create new
   - Inbound: HTTP (80) from 0.0.0.0/0
   - Inbound: HTTPS (443) from 0.0.0.0/0
8. **Target Group**:
   - Name: `m-platform-tg`
   - Protocol: HTTP
   - Port: 5000
   - Health check: `/health`
9. Click **Create**

**Save the ALB DNS Name** (looks like: `m-platform-alb-1234567.us-east-1.elb.amazonaws.com`)

### Step 5.6: Create ECS Service

```bash
# Replace with your values:
# ALB_ARN: from console
# TARGET_GROUP_ARN: from console
# SUBNET_1, SUBNET_2: your subnets
# SECURITY_GROUP: your VPC security group

aws ecs create-service \
  --cluster m-platform \
  --service-name m-platform-service \
  --task-definition m-platform:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --load-balancers targetGroupArn=YOUR_TARGET_GROUP_ARN,containerName=m-platform,containerPort=5000 \
  --network-configuration "awsvpcConfiguration={subnets=[YOUR_SUBNET_1,YOUR_SUBNET_2],securityGroups=[YOUR_SECURITY_GROUP],assignPublicIp=DISABLED}" \
  --region $AWS_REGION
```

---

## PHASE 6: Verify Deployment (2 minutes)

### Step 6.1: Check ECS Tasks
```bash
aws ecs describe-services \
  --cluster m-platform \
  --services m-platform-service \
  --region $AWS_REGION \
  --query 'services[0].{desiredCount:desiredCount,runningCount:runningCount,deployments:deployments[*].{status:status,runningCount:runningCount}}'
```

### Step 6.2: Check Logs
```bash
aws logs tail /ecs/m-platform --follow --region $AWS_REGION
```

### Step 6.3: Visit Your App
```bash
# Open in browser:
http://YOUR_ALB_DNS_NAME
# (from Step 5.5)
```

---

## PHASE 7: Optional - Set Up Custom Domain (5 minutes)

### Step 7.1: Get SSL Certificate
```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region $AWS_REGION
```

### Step 7.2: Verify in Route 53
1. Go to **Route 53 > Hosted Zones**
2. Create hosted zone for your domain
3. Add the DNS validation records
4. Wait for certificate validation

### Step 7.3: Update ALB with HTTPS
1. Go to **ALB > Listeners > Add listener**
2. Protocol: HTTPS, Port: 443
3. Select your certificate
4. Forward to target group: `m-platform-tg`

### Step 7.4: Create Route 53 Record
```bash
# Create alias pointing to ALB
# Via Console:
1. Route 53 > Hosted Zones > yourdomain.com
2. Create Record
3. Name: yourdomain.com
4. Type: A
5. Alias: Yes
6. Alias target: Select your ALB
```

---

## That's It! 🎉

Your M Platform is now running on AWS!

### What You Have:
- ✅ Auto-scaling backend (2-10 instances)
- ✅ PostgreSQL database with backups
- ✅ Redis cache for sessions
- ✅ CloudWatch monitoring
- ✅ SSL/TLS encryption
- ✅ Global CDN ready

### Next Steps:
1. **Monitor**: Watch CloudWatch dashboards
2. **Scale**: Adjust desired count in ECS service
3. **Update**: Push new Docker image and ECS will auto-deploy
4. **Backup**: RDS backups run automatically

### Cost Check:
Run this to estimate monthly cost:
```bash
echo "ECS Fargate: ~$100-150/month"
echo "RDS (t3.small): ~$50-100/month"
echo "ElastiCache: ~$20-30/month"
echo "ALB: ~$20/month"
echo "------"
echo "Total: ~$190-300/month"
```

---

## Troubleshooting

**Tasks won't start?**
```bash
aws logs tail /ecs/m-platform --follow
```

**Can't access app?**
```bash
# Check security groups allow traffic from ALB to tasks
aws ec2 describe-security-groups --group-ids YOUR_SECURITY_GROUP
```

**Database connection failing?**
```bash
# Verify connection string in Secrets Manager
aws secretsmanager get-secret-value --secret-id m-platform/prod
```

---

## Questions?
Refer to `AWS_DEPLOYMENT_GUIDE.md` for detailed explanations of each component.
