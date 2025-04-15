# Launch Project Rules

## Quick Reference
All detailed project rules and standards are maintained in:
`docs/implementation/layer-00-planning/02-project-rules.md`

## Resource Discovery
1. Check AWS Tags first
2. Check Parameter Store second
3. Check documentation last

## Key Documentation Locations
```yaml
Project Rules: docs/implementation/layer-00-planning/02-project-rules.md
Layer Documentation: docs/implementation/layer-*/01-*-overview.md
Resource Details: docs/implementation/layer-*/resources/*.md
```

## Common Commands
```bash
# Find resource by tag
aws resourcegroupstaggingapi get-resources --tag-filters Key=Project,Values=launch

# Get resource details
aws ssm get-parameter --name "/launch/resources/<type>/<name>"
```

## See Also
- Layer-01 Infrastructure: docs/implementation/layer-01-project-setup/01-core-infrastructure-overview.md
- Layer-02 Database: docs/implementation/layer-02-database-foundation/01-database-foundation-overview.md
- Layer-03 Frontend: docs/implementation/layer-03-frontend-architecture/01-frontend-architecture-overview.md 