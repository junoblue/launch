# Database Foundation Overview

> **Note**: This is a "production first" implementation, meaning we are building directly in production without concern for existing users or data. This allows us to implement the optimal architecture from the start without migration complexities.

## Purpose
Establish the multi-tenant database architecture for "launch", ensuring proper data isolation, performance, and scalability while maintaining UILD integration across all database operations.

## AWS Resource Configuration

### RDS Instance Configuration
```yaml
Database:
  RDS Instance:
    Name: launch-rds-main
    Engine: PostgreSQL
    Version: 17.4
    Instance Class: db.t4g.medium  # POC Phase - Cost optimized
    Storage:
      Type: gp3
      Size: 400 GB
      IOPS: 3000
      Throughput: 125 MB/s
    Multi-AZ: false  # POC Phase - Will be enabled for production
    Subnets:
      - subnet-0ed0f7d900f687231 (us-west-2a)
      - subnet-0be2078d20cec6ee8 (us-west-2b)
    Security Group: sg-007799fca73ab5b45
    IAM Role: launch-role-db-service
    Encryption: false  # POC Phase - Will be enabled for production
    Monitoring:
      Enhanced: Basic  # POC Phase - Will be enhanced for production
      Log Exports:
        - postgresql
        - upgrade
      CloudWatch Role: launch-role-db-monitoring
    Backup:
      Retention: 7 days
      Window: 03:00-04:00 UTC
    Maintenance:
      Window: sun:05:00-sun:06:00 UTC
      Auto Minor Version: Enabled
    Status: Available
    Parameter Group: launch-pg-main
    Endpoint: launch-rds-main.cr4cyac0cdfd.us-west-2.rds.amazonaws.com:5432

Connection Pooling:
  Name: launch-pool-main
  Engine: pgbouncer
  Version: 1.18
  Configuration:
    MaxClientConn: 2000
    DefaultPoolSize: 100
    MinPoolSize: 10
    ReservePoolSize: 50
    MaxDBConnections: 100
    MaxUserConnections: 100
  Instance:
    Type: t3.medium
    Image: ami-0735c191cf914754d (Ubuntu 22.04 LTS)
    Count: 2
    Subnets:
      - subnet-0ed0f7d900f687231 (Private 2a)
      - subnet-0be2078d20cec6ee8 (Private 2b)
    Security Group: launch-sg-pool (sg-08d3c11d4fde25f8a)
    IAM:
      Role: launch-role-pool-service
      Policy: launch-policy-pool-service
      InstanceProfile: launch-profile-pool-service

Credentials:
  Storage: /launch/db/credentials (AWS Secrets Manager)
```

### Parameter Group Configuration
```yaml
Name: launch-pg-main
Family: postgres17
Parameters:
  max_connections: 1000
  shared_buffers: 1GB  # Optimized for t4g.medium
  effective_cache_size: 3GB
  maintenance_work_mem: 128MB
  checkpoint_completion_target: 0.9
  wal_buffers: 16MB
  default_statistics_target: 100
  random_page_cost: 1.1
  effective_io_concurrency: 200
  work_mem: 4MB
  min_wal_size: 1GB
  max_wal_size: 4GB
  max_worker_processes: 4
  max_parallel_workers_per_gather: 2
  max_parallel_workers: 4
  max_parallel_maintenance_workers: 2
```

### Monitoring Configuration
```yaml
CloudWatch:
  Metrics:
    - CPU Utilization
    - FreeableMemory
    - ReadIOPS
    - WriteIOPS
    - DatabaseConnections
    - FreeStorageSpace
  Alarms:
    HighCPU:
      Threshold: 80%
      Period: 300
      EvaluationPeriods: 2
    LowStorage:
      Threshold: 20%
      Period: 300
      EvaluationPeriods: 2
    HighConnections:
      Threshold: 1000
      Period: 60
      EvaluationPeriods: 3

Performance Insights:
  Retention: 7 days
  Aggregation: Hour
  Metrics:
    - db.load.avg
    - db.load.max
    - db.sessions.active
```

## Data Model

### Core Schema
```sql
-- Tenant Management
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,  -- UILD format
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,  -- UILD of creator
    updated_by TEXT NOT NULL,  -- UILD of last modifier
    version INTEGER DEFAULT 1,
    settings JSONB DEFAULT '{}',
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON tenants
    USING (id = current_setting('app.tenant_id')::TEXT)
    WITH CHECK (id = current_setting('app.tenant_id')::TEXT);

-- Base Entity Template
CREATE TABLE base_entity (
    id TEXT PRIMARY KEY,  -- UILD format
    tenant_id TEXT NOT NULL REFERENCES tenants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,  -- UILD of creator
    updated_by TEXT NOT NULL,  -- UILD of last modifier
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Audit Log
CREATE TABLE audit_log (
    id TEXT PRIMARY KEY,  -- UILD format
    tenant_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes JSONB,
    performed_by TEXT NOT NULL,  -- UILD of actor
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (performed_at);

-- Monthly Partition
CREATE TABLE audit_log_y2024m04 PARTITION OF audit_log
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

-- Indexes
CREATE INDEX idx_audit_tenant_date ON audit_log (tenant_id, performed_at);
CREATE INDEX idx_audit_entity ON audit_log (entity_id, entity_type);
```

### Connection Management
```typescript
interface ConnectionConfig {
  poolConfig: {
    min: 10,
    max: 100,
    idleTimeoutMs: 60000,
    acquireTimeoutMs: 5000,
    createTimeoutMs: 5000,
    createRetryIntervalMs: 200,
    maxUses: 7200  // 2 hours
  },
  readConfig: {
    commandTimeout: 10000,
    statementTimeout: 30000,
    idleInTransactionTimeout: 60000
  },
  writeConfig: {
    commandTimeout: 30000,
    statementTimeout: 60000,
    idleInTransactionTimeout: 60000
  }
}
```

## Production Considerations

The following items are currently configured for POC but will be updated for production:

1. Instance Class
   - Current: db.t4g.medium (Cost optimized for POC)
   - Production: Will be upgraded based on performance requirements

2. Multi-AZ Deployment
   - Current: Disabled for POC
   - Production: Will be enabled for high availability

3. Encryption
   - Current: Disabled for POC
   - Production: Will be enabled for data security

4. Monitoring
   - Current: Basic monitoring
   - Production: Enhanced monitoring with detailed metrics

5. Backup Strategy
   - Current: 7-day retention
   - Production: Extended retention and point-in-time recovery

6. Performance Optimization
   - Current: Parameters optimized for t4g.medium
   - Production: Will be tuned for production instance class