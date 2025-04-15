# Template Management Scripts

## Core Scripts Overview

### 1. clean-sensitive-data.sh
```yaml
Purpose: Sanitize templates for reuse
Actions:
  - Remove AWS credentials/keys
  - Clear environment-specific variables
  - Remove .env files
  - Strip internal IPs/domains
  - Remove personal identifiers
  - Clear terraform state files

Example:
  ```bash
  ./scripts/clean-sensitive-data.sh
  # Scanning for sensitive data...
  # ✓ Removed AWS credentials from config files
  # ✓ Cleared .env files
  # ✓ Sanitized terraform state
  # ✓ Removed internal endpoints
  ```
```

### 2. create-template-checkpoint.sh
```yaml
Purpose: Create verified template points
Actions:
  - Verify current state
  - Create template branch
  - Clean sensitive data
  - Update documentation
  - Create git tag
  - Push to template repository

Example:
  ```bash
  ./scripts/create-template-checkpoint.sh layer-01 vpc
  # Verifying layer-01 VPC configuration...
  # ✓ All tests passed
  # ✓ Documentation updated
  # ✓ Template branch created: template/layer-01-vpc
  # ✓ Tagged: layer-01-vpc-v1.0.0
  ```
```

### 3. verify-layer.sh
```yaml
Purpose: Comprehensive layer verification
Actions:
  - Run infrastructure tests
  - Verify AWS resources
  - Check dependencies
  - Validate documentation
  - Test connectivity
  - Verify security configs

Example:
  ```bash
  ./scripts/verify-layer.sh 01
  # Verifying Layer-01...
  # ✓ VPC configuration valid
  # ✓ Security groups properly configured
  # ✓ IAM roles verified
  # ✓ All required documentation present
  ```
```

### 4. apply-project-config.sh
```yaml
Purpose: Customize template for new project
Actions:
  - Update project names
  - Configure AWS regions
  - Set resource naming
  - Update CIDR ranges
  - Configure endpoints
  - Set up monitoring

Example:
  ```bash
  ./scripts/apply-project-config.sh new-project-config.yaml
  # Applying configuration...
  # ✓ Project name updated
  # ✓ AWS region set to us-west
  # ✓ CIDR ranges configured
  # ✓ Resource names updated
  ```
```

### 5. update-template-docs.sh
```yaml
Purpose: Maintain template documentation
Actions:
  - Update README files
  - Generate usage examples
  - Document customization points
  - Update verification steps
  - Add dependency information
  - Record known issues

Example:
  ```bash
  ./scripts/update-template-docs.sh layer-01
  # Updating documentation...
  # ✓ README.md updated
  # ✓ Generated usage examples
  # ✓ Added latest verification steps
  # ✓ Updated dependency diagram
  ```
```

### 6. template-status.sh
```yaml
Purpose: Report template health/status
Actions:
  - Check template versions
  - Verify dependencies
  - List customization points
  - Show last verification
  - Check for updates
  - Validate structure

Example:
  ```bash
  ./scripts/template-status.sh
  # Template Status Report
  # Layer-00: ✓ v1.2.0 (Latest)
  # Layer-01: ✓ v1.0.1 (Update available)
  # Layer-02: ⚠ Unverified changes
  ```
```

## Usage Examples

### Starting New Project
```bash
# 1. Create project from template
./scripts/create-project.sh new-project layer-01-complete

# 2. Apply custom configuration
./scripts/apply-project-config.sh config/new-project.yaml

# 3. Verify setup
./scripts/verify-layer.sh 01
```

### Creating Recovery Point
```bash
# 1. Verify current state
./scripts/verify-layer.sh 01

# 2. Create template checkpoint
./scripts/create-template-checkpoint.sh layer-01 vpc

# 3. Verify template
./scripts/template-status.sh
```

### Updating Template
```bash
# 1. Check current status
./scripts/template-status.sh

# 2. Apply updates
./scripts/update-template.sh layer-01

# 3. Clean and verify
./scripts/clean-sensitive-data.sh
./scripts/verify-layer.sh 01
```

## Script Maintenance Guidelines
```yaml
When to Update Scripts:
  - New AWS services added
  - Security requirements change
  - New verification steps needed
  - Additional customization points
  - Bug fixes/improvements

Version Control:
  - Scripts versioned with templates
  - Backward compatibility maintained
  - Changes documented
  - Tests updated
``` 