# Connectivity Configuration

## AWS Connection
```yaml
Environment: WSL2 Ubuntu
Access Type: Root
Region: us-west
Profile: launch-admin

Connection Verification:
  ```bash
  # Verify AWS connectivity
  aws sts get-caller-identity
  
  # Verify region setting
  aws configure get region
  ```

Common Issues:
  1. If AWS CLI commands fail:
     - Check AWS credentials in ~/.aws/credentials
     - Verify AWS_PROFILE is set correctly
     - Ensure WSL has network connectivity
  
  2. If permission denied:
     - Verify AWS root access
     - Check IAM role permissions
     - Validate AWS SSO session if applicable
```

## GitHub Repository
```yaml
Repository: https://github.com/junoblue/launch.git
Access: Git over HTTPS
Branch Strategy:
  main: Production ready code
  develop: Integration branch
  feature/*: Feature development
  release/*: Release preparation

Connection Verification:
  ```bash
  # Verify GitHub connectivity
  git remote -v
  
  # Test authentication
  git fetch origin
  ```

Common Issues:
  1. If git push fails:
     - Check GitHub credentials
     - Verify repository permissions
     - Ensure WSL has network connectivity
  
  2. If authentication fails:
     - Update GitHub token
     - Check SSH keys if using SSH
     - Verify git config settings
```

## Local Development Environment
```yaml
WSL Configuration:
  Distribution: Ubuntu
  Version: WSL2
  Mount Points:
    Windows: /mnt/c
    Project: /home/shasta/launch

Environment Variables:
  AWS_PROFILE: launch-admin
  AWS_REGION: us-west
  GITHUB_TOKEN: <configured in WSL>

Connection Test Script:
  ```bash
  # Test all connections
  function test_connectivity() {
    echo "Testing AWS connection..."
    aws sts get-caller-identity
    
    echo "Testing GitHub connection..."
    git ls-remote https://github.com/junoblue/launch.git
    
    echo "Checking WSL network..."
    curl -I https://api.github.com
    curl -I https://aws.amazon.com
  }
  ```
``` 