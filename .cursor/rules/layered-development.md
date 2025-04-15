# Layered Development Rules

## Current Layer Status
```yaml
Active Layer: Layer-01 Core Infrastructure
Status: In Progress
Last Verified Component: VPC Setup [✓] 2024-01-20 14:30 UTC
Next Component: Security Groups
Safe to Stop: Yes

Defined Layers:
  Layer-00: Project Planning [✓]
    - Rules and Standards [✓]
    - Documentation Structure [✓]
    - Verification Process [✓]
    Last Verified: 2024-01-20 13:00 UTC

  Layer-01: Core Infrastructure [⚠]
    - VPC Setup [✓]
    - Security Groups [⚠]
    - IAM Configuration [⌛]
    Last Component Verified: 2024-01-20 14:30 UTC

  Layer-02: Database Foundation [⌛]
    Status: Pending Layer-01 completion
    Dependencies: All Layer-01 components verified

Future Layers:
  Note: "Will be defined after Layer-02 verification"
```

## Layer Definition Process
```yaml
When to Define New Layer:
  1. Previous layer fully verified
  2. All dependencies documented
  3. Implementation patterns established
  4. Lessons learned incorporated

Layer Definition Requirements:
  1. Clear dependencies on previous layers
  2. Concrete success criteria
  3. Specific verification steps
  4. Resource naming patterns
  5. Required AWS services identified

Documentation Updates:
  1. Update project rules
  2. Create layer overview
  3. Define verification steps
  4. Document dependencies
```

## Layer Verification Commands
```bash
# Check layer status
cat docs/implementation/layer-*/01-*-overview.md | grep -A 5 "Status:"

# Verify current layer dependencies
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=launch \
  Key=Layer,Values=layer-01 \
  Key=Status,Values=verified

# Get latest verification timestamps
find docs/implementation/layer-* -type f -exec grep -l "Last Verified:" {} \; | xargs grep "Last Verified:"
```

## Safe Stop/Resume Process
```bash
# Before stopping
./scripts/verify-layer-status.sh  # You'll need to create this
git add .
git commit -m "Layer-XX: Safe stop at component YY - All verifications complete"

# When resuming
./scripts/verify-layer-status.sh
./scripts/test-connections.sh
```

## Verification Template
```markdown
## Component Verification: <name>
Status: [Verified|Pending|Failed]
Last Verified: YYYY-MM-DD HH:MM:SS
Verified By: <username>

### Resource Status
```bash
# Run verification commands
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=launch \
  Key=Component,Values=<component-name>
```

### Dependencies
- Dependency 1: [✓] <verification-timestamp>
- Dependency 2: [✓] <verification-timestamp>

### Verification Steps
1. [✓] Step description
   - Command: `verification command`
   - Expected: expected output
   - Actual: actual output
   - Verified: YYYY-MM-DD HH:MM:SS
```

## Layer Transition Checklist
```yaml
Before Moving to Next Layer:
  1. Run full verification suite:
     ```bash
     ./scripts/verify-layer.sh <layer-number>
     ```
  
  2. Update documentation:
     ```bash
     # Update overview status
     vim docs/implementation/layer-XX-*/01-*-overview.md
     
     # Update verification timestamps
     find . -name "*.md" -exec grep -l "Last Verified" {} \; | xargs vim
     ```
  
  3. Tag resources:
     ```bash
     # Tag all layer resources as verified
     aws resourcegroupstaggingapi tag-resources \
       --resource-arn-list $(aws resourcegroupstaggingapi get-resources \
         --tag-filters Key=Layer,Values=layer-XX \
         --query 'ResourceTagMappingList[].ResourceARN' --output text) \
       --tags Status=verified,LastVerified=$(date -u +"%Y-%m-%d-%H-%M-%S")
     ```
``` 