# Project Rules

## Layered Development Approach

### Core Principles
```yaml
Build Order:
  - Each layer must be fully completed and verified before moving to next
  - No skipping layers or partial implementations
  - Each component within a layer must be verified
  - All verifications must be timestamped and documented

Current Defined Layers:
  Layer-00: Project Planning and Rules
    Purpose: Establish project structure, rules, and methodologies
    Status: [✓] Initial version complete
    Dependencies: None
    
  Layer-01: Core Infrastructure
    Purpose: AWS foundation for multi-tenant architecture
    Status: [⚠] In Progress
    Dependencies: Layer-00
    
  Layer-02: Database Foundation
    Purpose: Multi-tenant data architecture
    Status: [⌛] Pending Layer-01
    Dependencies: Layer-01

Future Layers:
  Note: "Subsequent layers will be defined in detail only after Layer-02 is complete. 
        This ensures our architecture decisions are grounded in working, verified implementations 
        rather than speculative design."

  Anticipated (Subject to Change):
    - Frontend Architecture
    - Authentication
    - User Management
    # Additional layers will be defined based on implemented foundation
```

### Layer Verification Process
```yaml
For Each Layer:
  1. Pre-Implementation:
    - Review previous layer's verification status
    - Confirm all dependencies are met
    - Document starting state
    
  2. During Implementation:
    - Complete each component sequentially
    - Verify each component before moving to next
    - Document all resource IDs and configurations
    - Add verification timestamps
    
  3. Post-Implementation:
    - Complete full layer verification
    - Update documentation with final state
    - Tag all resources with completion status
    - Create verification checkpoint

Verification Format:
  ```markdown
  ## Component: <name>
  Status: [Verified|Pending|Failed]
  Last Verified: YYYY-MM-DD HH:MM:SS
  Verified By: <username>
  Dependencies: [List of verified dependencies]
  
  ### Verification Steps:
  1. [✓] Step 1 description
     - Command: `verification command`
     - Expected: expected output
     - Actual: actual output
     - Verified: YYYY-MM-DD HH:MM:SS
  
  2. [✓] Step 2 description
     ...
  ```
```

### Layer Status Tracking
```yaml
Status Indicators:
  ✓ - Verified and Complete
  ⚠ - In Progress
  ✗ - Failed Verification
  ⌛ - Pending Dependencies

Example:
  Layer-01: Core Infrastructure [✓]
    - VPC Setup [✓] 2024-01-20 14:30 UTC
    - Security Groups [✓] 2024-01-20 15:45 UTC
    - IAM Roles [✓] 2024-01-20 16:15 UTC

  Layer-02: Database Foundation [⚠]
    - RDS Instance [✓] 2024-01-21 09:30 UTC
    - Schema Setup [⚠] In Progress
    - Backup Config [⌛] Pending RDS
```

## Resource Discovery and Documentation Rules

### 1. Resource Location Hierarchy
```yaml
Priority Order:
  1. AWS Resource Tags:
    - Always check tags first
    - Key resource IDs are in tags
    - Relationships defined in tags
    - Example: aws resourcegroupstaggingapi get-resources --tag-filters Key=Project,Values=launch

  2. Parameter Store:
    - Path: /launch/resources/*
    - Contains all resource IDs and references
    - Example: aws ssm get-parameter --name "/launch/resources/vpc/main"

  3. Documentation:
    - Path: docs/implementation/layer-*/
    - Contains architecture decisions and relationships
    - Each layer has its own overview document
```

### 2. Documentation Standards

#### Layer Documentation
```yaml
Each Layer Must Have:
  1. Overview Document:
    - Path: docs/implementation/layer-XX-name/01-name-overview.md
    - Contains: Purpose, components, dependencies
    - Must list: All resource IDs, ARNs, relationships

  2. Resource Details:
    - Path: docs/implementation/layer-XX-name/resources/
    - One file per major resource type
    - Contains: Configuration details, connections

  3. Diagrams:
    - Path: docs/implementation/layer-XX-name/diagrams/
    - Required: Architecture diagram, resource relationship diagram
```

### 3. Resource Naming Convention
```yaml
Format: launch-{resource_type}-{descriptor}

Examples:
  VPC: launch-vpc-main
  Subnet: launch-subnet-private-1a
  Security Group: launch-sg-database
  IAM Role: launch-role-service

Rules:
  - All lowercase
  - Use hyphens as separators
  - Keep descriptors brief but meaningful
  - Include availability zone where relevant
```

### 4. Resource Tagging Requirements
```yaml
Mandatory Tags:
  Project: launch
  Layer: layer-XX
  Name: <resource-name>
  ResourceType: <vpc|subnet|sg|etc>
  ManagedBy: terraform

Relationship Tags:
  launch:related-resources: <comma-separated-ids>
  launch:depends-on: <comma-separated-ids>
```

### 5. Resource Lookup Commands
```bash
# Always use these commands for resource discovery
# Do NOT manually search in AWS Console

# Find VPC
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=Project,Values=launch Key=ResourceType,Values=vpc

# Find related resources
aws resourcegroupstaggingapi get-resources \
  --tag-filters Key=launch:related-resources,Values=<resource-id>

# Get resource details
aws ssm get-parameter \
  --name "/launch/resources/<resource-type>/<name>"
```

### 6. Documentation Update Rules
```yaml
When to Update:
  1. Before Implementation:
    - Document planned resources
    - Update overview with new components
    - Create/update diagrams

  2. During Implementation:
    - Record actual resource IDs
    - Update relationship tags
    - Document configuration changes

  3. After Implementation:
    - Verify all IDs are documented
    - Update status and verification dates
    - Add any lessons learned
```

### 7. Resource Verification Process
```yaml
Verification Steps:
  1. Check Resource Exists:
    - Use AWS CLI commands above
    - Verify against documentation
    - Check all required tags

  2. Verify Relationships:
    - Check related resource tags
    - Validate dependencies
    - Confirm bi-directional links

  3. Document Verification:
    - Update last verified timestamp
    - Record any discrepancies
    - Update documentation if needed
```

### 8. Layer Dependencies
```yaml
Layer Rules:
  - Each layer must document dependencies on previous layers
  - Resources must reference dependencies in tags
  - Documentation must include dependency diagram
  - Changes must consider impact on dependent layers
```

### 9. Resource State Management
```yaml
State Information:
  - Store in Parameter Store
  - Update documentation
  - Include in resource tags
  - Version control all changes
```

### 10. Error Resolution
```yaml
When Resource Not Found:
  1. Check tags using resourcegroupstaggingapi
  2. Verify Parameter Store entries
  3. Review layer documentation
  4. Check dependency relationships
  5. Update documentation if incorrect
```

## Implementation Checkpoints

### Checkpoint Requirements
```yaml
Each Checkpoint Must Include:
  1. State Verification:
    - All resource statuses
    - Configuration values
    - Resource relationships
    - Performance metrics
    
  2. Documentation Update:
    - Updated diagrams
    - Resource IDs and ARNs
    - Configuration changes
    - Known issues
    
  3. Dependency Validation:
    - Cross-reference with previous layer
    - Verify all connections
    - Test integration points
    - Document any gaps
```

### Safe Stopping Points
```yaml
Criteria for Safe Stop:
  1. Current component verification complete
  2. All resources in stable state
  3. Documentation updated
  4. No pending transactions
  5. All logs archived

Before Stopping:
  1. Document current state
  2. Commit all changes
  3. Update verification timestamps
  4. Note next steps
```

### Resuming Work
```yaml
Steps to Resume:
  1. Review last verification checkpoint
  2. Verify resource states
  3. Test connections
  4. Update timestamps
  5. Proceed with next component
``` 