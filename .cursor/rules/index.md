# Cursor Rules Index

## General Rules
- [Communication Rules](communication.md) - Guidelines for team communication
- [Project Rules](project.md) - Launch project-specific rules and standards
- [Connectivity Rules](connectivity.md) - AWS and GitHub connection configuration
- [Command Patterns](command-patterns.md) - Correct command formats and common mistakes
- [Layered Development](layered-development.md) - Layer-by-layer build and verification process
- [Git Structure](git-structure.md) - Repository organization and templating

## Current Layer Status
```yaml
Active: Layer-01 Core Infrastructure
Status: In Progress
Last Verified: VPC Setup [✓] 2024-01-20 14:30 UTC
Safe to Stop: Yes

Template Status:
  Layer-00: Template Available [✓]
    Tag: layer-00-complete
    Last Verified: 2024-01-20 13:00 UTC
  
  Layer-01: In Progress [⚠]
    Latest Tag: layer-01-vpc
    Next: Security Groups
```

## Layer Verification Process
1. Check [Layered Development](layered-development.md) for current status
2. Follow verification checklist for each component
3. Update timestamps and documentation
4. Create template checkpoint (see [Git Structure](git-structure.md))
5. Only proceed when current layer is fully verified

## Environment Configuration
- AWS Connection: Root access via WSL2 Ubuntu
- GitHub Repository: https://github.com/junoblue/launch.git
- WSL Setup: Ubuntu distribution with mounted project at /home/shasta/launch

## Command Pattern Updates
Before running any command:
1. Check [Command Patterns](command-patterns.md) for correct format
2. If command fails, document the correction
3. Update patterns file with new learnings
4. Share updates with team

## Project Documentation
For detailed project rules and standards, see:
`docs/implementation/layer-00-planning/02-project-rules.md`

## Quick Links
- Project Rules: [02-project-rules.md](../../docs/implementation/layer-00-planning/02-project-rules.md)
- Infrastructure Overview: [01-core-infrastructure-overview.md](../../docs/implementation/layer-01-project-setup/01-core-infrastructure-overview.md)
- Database Foundation: [01-database-foundation-overview.md](../../docs/implementation/layer-02-database-foundation/01-database-foundation-overview.md)
- Frontend Architecture: [01-frontend-architecture-overview.md](../../docs/implementation/layer-03-frontend-architecture/01-frontend-architecture-overview.md)

## Quick Commands
```bash
# Check layer status
cat docs/implementation/layer-*/01-*-overview.md | grep -A 5 "Status:"

# List available templates
git tag -l "layer-*"

# Create recovery point
./scripts/create-template-checkpoint.sh

# Verify current layer
./scripts/verify-layer-status.sh

# Get latest verifications
find docs/implementation/layer-* -type f -exec grep -l "Last Verified:" {} \; | xargs grep "Last Verified:"

# Test all connections
source connectivity.md
test_connectivity

# Verify AWS configuration
aws configure list

# Check GitHub connection
git remote -v

# Verify command pattern
cat command-patterns.md | grep -A 5 "Correct Pattern:"
``` 