# Command Patterns and Corrections

## AWS Commands

### Resource Querying
```yaml
Correct Pattern:
  # Get resource by tags
  aws resourcegroupstaggingapi get-resources \
    --tag-filters Key=Project,Values=launch \
    Key=ResourceType,Values=vpc

  # NOT
  aws resource-groups-tagging-api get-resources --tags Project=launch  # Wrong API name
  aws tag get-resources  # Incomplete command

Common Mistakes:
  - Forgetting to use resourcegroupstaggingapi (one word)
  - Missing backslashes for line continuation
  - Incorrect tag filter format
```

### Parameter Store
```yaml
Correct Pattern:
  # Get parameter
  aws ssm get-parameter \
    --name "/launch/resources/vpc/main" \
    --query "Parameter.Value" \
    --output text

  # NOT
  aws ssm get-params  # Wrong command name
  aws ssm get-parameter --name launch/vpc  # Missing leading slash

Common Mistakes:
  - Missing quotes around parameter names
  - Incorrect path format (must start with /)
  - Missing --query for specific values
```

### Region Operations
```yaml
Correct Pattern:
  # Set region
  aws configure set region us-west-1

  # NOT
  aws config region us-west-1  # Wrong command
  aws configure --region us-west-1  # Incorrect syntax

Common Mistakes:
  - Using 'config' instead of 'configure'
  - Wrong region format
```

## Git Commands

### Repository Operations
```yaml
Correct Pattern:
  # Clone repository
  git clone https://github.com/junoblue/launch.git

  # Add remote
  git remote add origin https://github.com/junoblue/launch.git

  # NOT
  git clone github.com/junoblue/launch  # Missing https://
  git remote add github.com/junoblue/launch  # Missing origin and https://

Common Mistakes:
  - Missing protocol (https://)
  - Missing .git suffix
  - Incorrect remote name
```

### Branch Operations
```yaml
Correct Pattern:
  # Create and switch to new branch
  git checkout -b feature/new-feature

  # NOT
  git branch feature/new-feature  # Only creates, doesn't switch
  git checkout feature-new-feature  # Wrong naming convention

Common Mistakes:
  - Wrong branch naming convention
  - Forgetting -b for new branches
  - Using spaces in branch names
```

## WSL Commands

### Path Navigation
```yaml
Correct Pattern:
  # Navigate to project
  cd /home/shasta/launch

  # NOT
  cd ~/launch  # Ambiguous home directory
  cd $HOME/launch  # Inconsistent with team convention

Common Mistakes:
  - Using ~ instead of full path
  - Wrong path separators
  - Case sensitivity issues
```

### File Operations
```yaml
Correct Pattern:
  # Copy files
  cp -r /source/path /destination/path

  # NOT
  cp /source/path /destination/path  # Missing -r for directories
  copy source destination  # Wrong command

Common Mistakes:
  - Missing flags (-r for directories)
  - Wrong path format
  - Wrong command names
```

## Command Update Process
```yaml
When to Update This File:
  1. After any command correction:
     - Document the correct format
     - Document the incorrect format
     - Add common mistakes
     - Add explanation

  2. When discovering new patterns:
     - Add new section if needed
     - Include all variations
     - Document edge cases

  3. After team feedback:
     - Update based on common issues
     - Add clarifying examples
     - Include new scenarios
```

## Command Verification
```yaml
Before Running Commands:
  1. Check this document for correct pattern
  2. Verify all required parameters
  3. Test in non-production first
  4. Document any new patterns found

After Command Failures:
  1. Document the error
  2. Update this file with correction
  3. Share with team if new pattern
  4. Add to common mistakes if applicable
``` 