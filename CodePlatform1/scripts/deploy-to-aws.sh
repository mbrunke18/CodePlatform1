#!/bin/bash
# AWS Deployment Script for M Strategic Execution Operating System
# Usage: ./scripts/deploy-to-aws.sh [environment] [action]
# Example: ./scripts/deploy-to-aws.sh prod build-and-push

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
ACTION=${2:-build-and-push}
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME="m-platform"
IMAGE_NAME="m-platform"

# Derived variables
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"
COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_TAG="${COMMIT_HASH}-${ENVIRONMENT}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}M Platform - AWS Deployment Script${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo "Environment: $ENVIRONMENT"
echo "Action: $ACTION"
echo "Region: $AWS_REGION"
echo "Account ID: $AWS_ACCOUNT_ID"
echo "ECR URI: $ECR_URI"
echo "Image Tag: $IMAGE_TAG"
echo ""

# Function: Create ECR repository if it doesn't exist
create_ecr_repo() {
    echo -e "${YELLOW}Checking ECR repository...${NC}"
    if aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" 2>/dev/null; then
        echo -e "${GREEN}✓ ECR repository exists${NC}"
    else
        echo -e "${YELLOW}Creating ECR repository...${NC}"
        aws ecr create-repository \
            --repository-name "$ECR_REPO_NAME" \
            --region "$AWS_REGION" \
            --image-scanning-configuration scanOnPush=true
        echo -e "${GREEN}✓ ECR repository created${NC}"
    fi
}

# Function: Build Docker image
build_image() {
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build \
        --tag "$IMAGE_NAME:$IMAGE_TAG" \
        --tag "$IMAGE_NAME:latest" \
        --build-arg BUILD_DATE="$TIMESTAMP" \
        --build-arg VCS_REF="$COMMIT_HASH" \
        .
    echo -e "${GREEN}✓ Docker image built: $IMAGE_NAME:$IMAGE_TAG${NC}"
}

# Function: Login to ECR
ecr_login() {
    echo -e "${YELLOW}Logging in to ECR...${NC}"
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "$ECR_URI"
    echo -e "${GREEN}✓ ECR login successful${NC}"
}

# Function: Push to ECR
push_image() {
    echo -e "${YELLOW}Pushing image to ECR...${NC}"
    docker tag "$IMAGE_NAME:$IMAGE_TAG" "$ECR_URI:$IMAGE_TAG"
    docker tag "$IMAGE_NAME:latest" "$ECR_URI:latest"
    
    docker push "$ECR_URI:$IMAGE_TAG"
    docker push "$ECR_URI:latest"
    
    echo -e "${GREEN}✓ Images pushed to ECR${NC}"
    echo "  - $ECR_URI:$IMAGE_TAG"
    echo "  - $ECR_URI:latest"
}

# Function: Test locally with docker-compose
test_locally() {
    echo -e "${YELLOW}Testing Docker image locally...${NC}"
    docker-compose build
    
    # Run tests in container
    docker-compose run --rm app npm run check
    
    echo -e "${GREEN}✓ Local tests passed${NC}"
}

# Function: Start local services
start_local() {
    echo -e "${YELLOW}Starting local services (docker-compose)...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Services started${NC}"
    echo "  - App: http://localhost:5000"
    echo "  - Database: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# Function: Stop local services
stop_local() {
    echo -e "${YELLOW}Stopping local services...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Services stopped${NC}"
}

# Function: Update ECS service
update_ecs_service() {
    local cluster=$1
    local service=$2
    
    echo -e "${YELLOW}Updating ECS service...${NC}"
    aws ecs update-service \
        --cluster "$cluster" \
        --service "$service" \
        --force-new-deployment \
        --region "$AWS_REGION"
    echo -e "${GREEN}✓ ECS service update triggered${NC}"
}

# Function: Check deployment status
check_deployment() {
    local cluster=$1
    local service=$2
    
    echo -e "${YELLOW}Checking deployment status...${NC}"
    aws ecs describe-services \
        --cluster "$cluster" \
        --services "$service" \
        --region "$AWS_REGION" \
        --query 'services[0].{desiredCount:desiredCount,runningCount:runningCount,deployments:deployments[*].{status:status,runningCount:runningCount,desiredCount:desiredCount}}'
}

# Function: View logs
view_logs() {
    local log_group=$1
    
    echo -e "${YELLOW}Fetching recent logs...${NC}"
    aws logs tail "$log_group" \
        --follow \
        --region "$AWS_REGION"
}

# Main execution
case "$ACTION" in
    build)
        build_image
        ;;
    test)
        test_locally
        ;;
    build-and-test)
        build_image
        test_locally
        ;;
    push)
        create_ecr_repo
        ecr_login
        push_image
        ;;
    build-and-push)
        build_image
        create_ecr_repo
        ecr_login
        push_image
        ;;
    local-start)
        start_local
        ;;
    local-stop)
        stop_local
        ;;
    local-test)
        test_locally
        ;;
    deploy)
        if [ -z "$3" ] || [ -z "$4" ]; then
            echo -e "${RED}Usage: $0 $ENVIRONMENT deploy <cluster-name> <service-name>${NC}"
            exit 1
        fi
        build_image
        create_ecr_repo
        ecr_login
        push_image
        update_ecs_service "$3" "$4"
        check_deployment "$3" "$4"
        ;;
    status)
        if [ -z "$3" ] || [ -z "$4" ]; then
            echo -e "${RED}Usage: $0 $ENVIRONMENT status <cluster-name> <service-name>${NC}"
            exit 1
        fi
        check_deployment "$3" "$4"
        ;;
    logs)
        if [ -z "$3" ]; then
            echo -e "${RED}Usage: $0 $ENVIRONMENT logs <log-group-name>${NC}"
            exit 1
        fi
        view_logs "$3"
        ;;
    *)
        echo -e "${RED}Unknown action: $ACTION${NC}"
        echo ""
        echo "Available actions:"
        echo "  build              - Build Docker image locally"
        echo "  test               - Run tests in Docker"
        echo "  build-and-test     - Build and test"
        echo "  push               - Push to ECR"
        echo "  build-and-push     - Build and push to ECR"
        echo "  local-start        - Start local services (docker-compose)"
        echo "  local-stop         - Stop local services"
        echo "  local-test         - Test locally"
        echo "  deploy             - Full deployment to ECS"
        echo "  status             - Check ECS service status"
        echo "  logs               - Tail CloudWatch logs"
        echo ""
        echo "Examples:"
        echo "  ./scripts/deploy-to-aws.sh prod build-and-push"
        echo "  ./scripts/deploy-to-aws.sh prod deploy m-platform m-platform-service"
        echo "  ./scripts/deploy-to-aws.sh prod status m-platform m-platform-service"
        echo "  ./scripts/deploy-to-aws.sh prod logs /ecs/m-platform"
        exit 1
        ;;
esac

echo -e "${GREEN}Done!${NC}"
