# GitHub CI/CD Process Guide

> Last Updated: 2024-04-16
> 
> Recent Changes:
> - Implemented automated infrastructure deployment using AWS CDK
> - Added comprehensive testing workflow
> - Integrated AWS credentials management
> - Enhanced deployment validation steps
> - Added S3 deployment permissions to GitHub Actions role
> - Consolidated workflows into single main.yml
> - Fixed frontend build issues with Radix UI

## Overview

This document outlines the CI/CD (Continuous Integration/Continuous Deployment) process for the Launch application, focusing on best practices, deployment strategies, and monitoring. The process is implemented using GitHub Actions and AWS CDK for infrastructure deployment.

## Core Principles

1. **Reproducible Builds**
   - All dependencies explicitly defined in package.json
   - Use lock files (package-lock.json)
   - Consistent build environments using GitHub Actions
   - Automated validation steps

2. **Environment Consistency**
   - Infrastructure as Code using AWS CDK
   - Environment variables managed through AWS Systems Manager
   - Separate configuration for different environments

3. **Automated Testing**
   - Pre-deployment test execution
   - Unit and integration test coverage
   - Automated validation of deployment success

## Current Workflow Implementation

### 1. Trigger Conditions
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

### 2. Test Job
- Runs on every push and pull request
- Uses Ubuntu latest runner
- Node.js v18 environment
- Validates code quality and functionality

### 3. Deployment Job
- Runs only on main branch pushes
- Requires successful test job completion
- Deploys infrastructure using AWS CDK
- Uses AWS credentials from GitHub Secrets

## Detailed Process Steps

### 1. Environment Setup
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
```

### 2. Dependency Management
```yaml
- name: Install dependencies
  run: npm install
```

### 3. Testing
```yaml
- name: Run tests
  run: npm test
```

### 4. Infrastructure Deployment
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy infrastructure
  run: |
    cd aws/infrastructure
    npm install
    cdk deploy --require-approval never
```

## Security Considerations

1. **Access Control**
   - IAM roles with least privilege
   - AWS credentials stored in GitHub Secrets
   - Regular access reviews
   - S3 bucket access for deployments

2. **Secret Management**
   - AWS credentials managed through GitHub Secrets
   - Regular credential rotation
   - Secret usage auditing

3. **Network Security**
   - VPC endpoints
   - Security groups
   - Network traffic monitoring

## IAM Role Configuration

### GitHub Actions Role

The `launch-github-actions-role` includes the following policies:

1. **Trust Policy**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::597088015766:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:*"
                }
            }
        }
    ]
}
```

2. **S3 Deployment Policy**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::launch-deployment",
                "arn:aws:s3:::launch-deployment/*"
            ]
        }
    ]
}
```

## Monitoring and Validation

### 1. Health Checks
- Infrastructure deployment validation
- Service status monitoring
- Deployment event logging
- Build output verification

### 2. Rollback Procedures
- Maintain previous infrastructure state
- Document rollback steps
- Test rollback procedures

### 3. Logging
- Centralized logging
- Deployment context included
- Error rate monitoring

## Required GitHub Secrets

The following secrets must be configured in the GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment

## Continuous Improvement

1. **Metrics Collection**
   - Deployment success rate
   - Build time
   - Test coverage

2. **Regular Reviews**
   - Deployment procedures
   - Security practices
   - Build processes

3. **Documentation**
   - Updated deployment guides
   - Troubleshooting steps
   - Runbooks

## Best Practices

1. **Code Quality**
   - Run tests before deployment
   - Validate infrastructure changes
   - Maintain clean code standards

2. **Deployment Safety**
   - Use infrastructure as code
   - Implement proper error handling
   - Monitor deployment progress

3. **Security**
   - Regular credential rotation
   - Least privilege access
   - Security scanning

## Deployment Issues Log

### 2024-04-16

#### 00:21 UTC - Frontend Build Error
- **Issue**: TypeScript errors with Radix UI navigation menu
- **Details**: 
  - Error: Property 'Item', 'Trigger', 'Content' not found on NavigationMenu component
  - Component: `ShellLayout.tsx`
  - Root cause: Incorrect import method for Radix UI components
- **Resolution**:
  1. Updated import to `import * as NavigationMenu from '@radix-ui/react-navigation-menu'`
  2. Changed component structure to use `NavigationMenu.Root` and `NavigationMenu.List`
  3. Fixed component hierarchy according to Radix UI documentation
  4. Verified successful build after changes

#### 00:25 UTC - Workflow Consolidation
- **Issue**: Duplicate deployments due to multiple workflow files
- **Details**: 
  - Two workflows (`main.yml` and `deploy-login.yml`) were triggering on each push
  - Both workflows were attempting to deploy the frontend
- **Resolution**:
  1. Removed redundant `deploy-login.yml` workflow
  2. Consolidated all deployment steps into `main.yml`
  3. Verified single workflow execution per push

#### 00:13 UTC - S3 Permission Issue
- **Issue**: GitHub Actions role lacking S3 permissions
- **Details**: 
  - Error: `AccessDenied when calling the PutObject operation`
  - Role: `launch-github-actions-role`
  - Required permissions: `s3:PutObject`, `s3:GetObject`, `s3:ListBucket`
- **Resolution**:
  1. Created new IAM policy for S3 access
  2. Attached policy to GitHub Actions role
  3. Verified permissions using AWS CLI
  4. Tested with new deployment

### 2024-04-15

#### 23:56 UTC - Frontend Test Failure
- **Issue**: Frontend test failing due to incorrect import path in `App.test.tsx`
- **Details**: 
  - Test file attempting to import App component using `../App` path
  - Previous fix attempted to use `../../src/App` which was incorrect
  - Error: `Failed to resolve import "../../src/App" from "src/__tests__/App.test.tsx"`
- **Status**: In Progress
- **Next Steps**:
  1. Review test file location relative to component
  2. Verify correct import path based on project structure
  3. Update test configuration if needed

#### Previous Deployment Attempts
- Workflow run ID: 14481629654 - Failed (Frontend test failure)
- Workflow run ID: 14481629651 - Failed (Deploy Login App)
- Workflow run ID: 14481606963 - Failed (Launch Application CI/CD)
- Workflow run ID: 14481606960 - Failed (Deploy Login App)
- Workflow run ID: 14481556212 - Cancelled (Launch Application CI/CD)

### Action Items
1. Review and document the correct project structure for test files
2. Update test configuration to handle imports consistently
3. Consider adding path aliases to simplify imports
4. Add pre-commit hooks to validate test imports

## Conclusion

A robust CI/CD process requires:
- Clear documentation
- Automated testing
- Proper error handling
- Monitoring and validation
- Security considerations
- Continuous improvement

Regular reviews and updates to this process will help maintain a reliable deployment pipeline. 