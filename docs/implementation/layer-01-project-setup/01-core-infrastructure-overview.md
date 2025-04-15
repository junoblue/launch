# Core Infrastructure Overview

## Purpose
Establish the foundational AWS infrastructure components for our multi-tenant SaaS application "launch", focusing on the minimal necessary setup to support Layer-02 database foundation. This is a production-first implementation, as there are no existing users or data to be concerned with.

## AWS Configuration

### Region and Access
```yaml
Region: us-west-2 (Oregon)
Access: Root via WSL
Profile: launch-admin
```

### Naming Convention
```yaml
Project Prefix: launch
Environment: prod
Resource Format: ${project}-${resource_type}-${optional_descriptor}
Example: launch-vpc-main
```

### Existing Resources
```yaml
Domain:
  Primary: tokyoflo.com
  Admin Subdomain: samurai.tokyoflo.com
  Status: Active
  DNS Provider: Route 53
  Records:
    NS:
      - ns-1301.awsdns-34.org
      - ns-1576.awsdns-05.co.uk
      - ns-591.awsdns-09.net
      - ns-239.awsdns-29.com
    A:
      - login.tokyoflo.com -> dy387gxdvcwpx.cloudfront.net
      - samurai.tokyoflo.com -> dy387gxdvcwpx.cloudfront.net

SSL Certificates:
  Primary: 811c18f1-3d85-4a1d-ae06-e855b9136e05
    Domain: tokyoflo.com
    Type: Amazon Issued
    Status: Active
  Wildcard: a5925eb8-a4da-45b2-9df8-602e8fe6bd13
    Domain: *.tokyoflo.com
    Type: Amazon Issued
    Status: Active
```

## Network Configuration

### VPC Setup
```yaml
VPC:
  ID: vpc-0933ad5aedf63061d
  CIDR: 10.0.0.0/16
  Status: Available

Subnets:
  Private (us-west-2a):
    ID: subnet-0ed0f7d900f687231
    CIDR: 10.0.1.0/24
    Purpose: Application instances
    
  Private (us-west-2b):
    ID: subnet-0be2078d20cec6ee8
    CIDR: 10.0.2.0/24
    Purpose: High availability
    
  Public (us-west-2a):
    ID: subnet-00e4cbb289823451c
    CIDR: 10.0.3.0/24
    Purpose: NAT Gateway/Load Balancer
    
  Public (us-west-2b):
    ID: subnet-0af0649bd70137e2a
    CIDR: 10.0.4.0/24
    Purpose: NAT Gateway/Load Balancer (HA)

Routing:
  Private Subnets:
    - Local: 10.0.0.0/16
    - Internet: via NAT Gateway (nat-0099d46bbe39f520c)
    - AWS Services: via VPC Endpoint (vpce-000535964f1882db1)
  
  Public Subnets:
    - Local: 10.0.0.0/16
    - Internet: via Internet Gateway (igw-016d27b7e8bdab641)

VPC Endpoints:
  - SSM: vpce-0ff21f29a38f8b71d
  - SSM Messages: vpce-008dfe9aacd6ad9d3
  - EC2 Messages: vpce-02d0e22b185e23d7c
```

### Security Groups
```yaml
Frontend (sg-0458a2bd52180c88d):
  Inbound:
    - Port 80: 0.0.0.0/0, 10.0.0.0/16
    - Port 443: VPC CIDR
  Outbound:
    - All traffic: 0.0.0.0/0

Backend (sg-0dfef8026145bb84f):
  Inbound:
    - Port 80: VPC CIDR
    - Port 8000: VPC CIDR
    - Port 443: VPC CIDR
  Outbound:
    - All traffic: 0.0.0.0/0
```

## Instance Configuration

### Frontend Instance (React)
```yaml
ID: i-04474421d6a28163d
Type: t3.medium
Private IP: 10.0.1.144
Subnet: subnet-0ed0f7d900f687231
Security Group: sg-0458a2bd52180c88d
Services:
  - Nginx (Active)
  - Static content server
Health Check: Passing
Last Updated: 2025-04-15
```

### Backend Instance (Python)
```yaml
ID: i-0a374e25291d206aa
Type: t3.medium
Private IP: 10.0.1.36
Subnet: subnet-0ed0f7d900f687231
Security Group: sg-0dfef8026145bb84f
Services:
  - Gunicorn (Active)
  - Flask API
  - Python 3.11
Health Check: Passing
Last Updated: 2025-04-15
```

## Deployment Configuration

### IAM Setup
```yaml
OIDC Provider: token.actions.githubusercontent.com
Role: launch-github-actions-role
Permissions:
  - SSM:SendCommand
  - SSM:GetCommandInvocation
  - SSM:ListCommandInvocations
  - SSM:DescribeInstanceInformation
  - EC2:DescribeInstances
  - EC2:DescribeInstanceStatus
  - SSM:GetParameter(s)
  - S3:CreateBucket
  - S3:PutObject
  - S3:GetObject
  - S3:ListBucket
Trust Relationship:
  - Federated: token.actions.githubusercontent.com
  - Action: sts:AssumeRoleWithWebIdentity
  - Condition: StringEquals aud=sts.amazonaws.com
```

### Deployment Process
```yaml
Frontend:
  Build:
    - Node.js 18
    - npm install --force
    - Vite build
  Deploy:
    - S3 artifact upload
    - SSM deployment
    - Nginx configuration
    - Health check verification

Backend:
  Build:
    - Python 3.11
    - Virtual environment
    - Requirements installation
    - Test execution
  Deploy:
    - S3 artifact upload
    - SSM deployment
    - Service management
    - Health check verification

Artifacts:
  Bucket: launch-artifacts
  Lifecycle: 7 days retention
  Access: GitHub Actions role only
```

## Monitoring and Security

### Health Checks
```yaml
Frontend:
  - /health endpoint
  - Nginx status
  - Static content
  - SSL certificates

Backend:
  - /health endpoint
  - Gunicorn status
  - Database connectivity
  - API responses
```

### Security Measures
```yaml
Network:
  - Private subnet isolation
  - NAT Gateway control
  - VPC endpoints
  - Security group rules

Access:
  - OIDC authentication
  - Least privilege IAM
  - SSM Session Manager
  - No SSH access

Monitoring:
  - CloudWatch metrics
  - VPC Flow Logs
  - Security group auditing
  - Health check alerts
```

## Local Development

### Required Tools
```yaml
AWS CLI:
  Version: 2.x
  Profile: launch-admin
  Path: /home/shasta/launch

Session Manager:
  Version: 1.2.707.0
  Installation: Package manager
  Required: Yes
```

### Access Methods
```yaml
Frontend:
  Command: aws ssm start-session --target i-04474421d6a28163d
  Path: /opt/launch/frontend
  Common Tasks:
    - Nginx configuration
    - Static file management
    - Log verification

Backend:
  Command: aws ssm start-session --target i-0a374e25291d206aa
  Path: /opt/launch/backend
  Common Tasks:
    - API management
    - Database operations
    - Log verification
```

## Current Status

Last Verified: 2025-04-15 19:52 UTC
Status: All components operational and verified
Health Checks: Passing
Deployment: Successful
Security: Validated