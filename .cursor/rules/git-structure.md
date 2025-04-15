# Git Structure Rules

## Layer-Based Branch Strategy
```yaml
Main Branches:
  main: Latest stable version
  templates: Base branch for all layer templates

Layer Template Branches:
  template/layer-00: Project setup template
    Tags:
      - layer-00-base: Initial project structure
      - layer-00-complete: Fully verified layer-00

  template/layer-01: Infrastructure template
    Tags:
      - layer-01-base: Basic AWS setup
      - layer-01-vpc: VPC configuration complete
      - layer-01-security: Security groups complete
      - layer-01-complete: Fully verified layer-01

  template/layer-02: Database template
    Tags:
      - layer-02-base: Initial DB setup
      - layer-02-complete: Fully verified layer-02

Development Flow:
  feature/*: Active development
  release/*: Release preparation
  hotfix/*: Emergency fixes
```

## Template Structure
```yaml
Each Layer Template Contains:
  1. Infrastructure as Code:
    - Terraform modules
    - AWS CloudFormation templates
    - Configuration files
    
  2. Documentation:
    - Layer overview
    - Component specifications
    - Verification steps
    
  3. Scripts:
    - Setup scripts
    - Verification scripts
    - Rollback procedures
    
  4. Tests:
    - Infrastructure tests
    - Integration tests
    - Verification tests
```

## Template Usage
```bash
# Create new project from template
git checkout -b new-project template/layer-01-complete

# Return to known good state
git checkout template/layer-01-vpc
git checkout -b recovery/layer-01

# Start new similar project
git checkout template/layer-00-complete
git checkout -b new-saas-project
```

## Layer Checkpointing Process
```yaml
When Layer is Verified:
  1. Create Template:
     ```bash
     # Create template branch
     git checkout -b template/layer-XX-complete

     # Clean sensitive data
     ./scripts/clean-sensitive-data.sh

     # Update template documentation
     ./scripts/update-template-docs.sh
     ```

  2. Tag Release:
     ```bash
     # Tag the verified state
     git tag -a layer-XX-complete -m "Layer XX complete and verified"
     
     # Push template and tag
     git push origin template/layer-XX-complete
     git push origin layer-XX-complete
     ```

  3. Update Template Documentation:
     - Remove environment-specific configs
     - Add template usage instructions
     - Document customization points
```

## Template Maintenance
```yaml
Regular Updates:
  - Security patches
  - AWS best practices
  - Dependency updates
  - Documentation improvements

Version Control:
  Major.Minor.Patch:
    Major: Breaking changes
    Minor: New features
    Patch: Bug fixes

Example:
  layer-01-v1.2.3:
    - v1: Major version
    - .2: Feature addition
    - .3: Bug fix
```

## Recovery Process
```yaml
When Issues Occur:
  1. Identify last good template:
     ```bash
     git tag -l "layer-*"  # List all layer tags
     ```

  2. Create recovery branch:
     ```bash
     git checkout -b recovery/layer-XX template/layer-XX-complete
     ```

  3. Apply project-specific changes:
     ```bash
     ./scripts/apply-project-config.sh
     ```

  4. Verify recovery:
     ```bash
     ./scripts/verify-layer.sh XX
     ```
```

## Template Usage Guidelines
```yaml
Do:
  - Start new projects from templates
  - Create recovery points regularly
  - Document template customization
  - Keep templates generic
  - Remove sensitive data

Don't:
  - Include credentials in templates
  - Mix project-specific code
  - Skip verification steps
  - Modify templates without review
``` 