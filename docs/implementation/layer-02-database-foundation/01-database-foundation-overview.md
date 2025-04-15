# Database Foundation Overview

> **Note**: This is a "production first" implementation, meaning we are building directly in production without concern for existing users or data. This allows us to implement the optimal architecture from the start without migration complexities.

> **Note**: Test resources are available in the core infrastructure (`docs/implementation/layer-01-project-setup/01-core-infrastructure-overview.md`), including test instances in both public and private subnets, which can be utilized for database connectivity testing and validation:
> - Public Test Instance: `i-0e1a7fcd23021fa28` (10.0.3.173)
> - Private Test Instance: `i-0d7095b72132e9e7c` (10.0.1.223)
> - Test Security Group: `sg-09429267085a63549`

## Purpose
Establish the multi-tenant database architecture for "launch", ensuring proper data isolation, performance, and scalability while maintaining UILD integration across all database operations. As this is a production-first implementation, we can focus on building the optimal architecture without legacy constraints.

## AWS Resource Configuration

### RDS Instance Configuration
```yaml
Database:
  RDS Instance:
    Name: launch-db-main
    Engine: PostgreSQL
    Version: 17.4
    Instance Class: db.t4g.medium
    Storage:
      Type: gp3
      Size: 400 GB
      IOPS: 12000
      Throughput: 500 MB/s
    Multi-AZ: false
    Subnets:
      - subnet-0ed0f7d900f687231 (us-west-2a)
      - subnet-0be2078d20cec6ee8 (us-west-2b)
    Security Group: sg-007799fca73ab5b45
    IAM Role: launch-role-db-service
    Encryption:
      Enabled: true
      KMS Key: arn:aws:kms:us-west-2:597088015766:key/62739486-7aa4-4cdb-9bfc-68dd7d80c7c0
    Monitoring:
      Enhanced Monitoring: Enabled
      Log Exports:
        - postgresql
        - upgrade
      CloudWatch Role: launch-role-db-monitoring
    Backup:
      Retention Period: 7 days
      Window: 03:00-04:00 UTC
    Maintenance:
      Window: sun:05:00-sun:06:00 UTC
      Auto Minor Version Upgrade: Enabled
    Status: Modifying
    Parameter Group: launch-pg-main (Applying changes)
    Endpoint: launch-db-main.cr4cyac0cdfd.us-west-2.rds.amazonaws.com:5432

Connection Pooling:
  Name: launch-pool-main
  Engine: pgbouncer
  Version: 1.18
  Launch Template:
    Name: launch-template-pool
    ID: lt-069300cd12b23bfa0
    Version: 1
    Instance:
      Type: t3.medium
      Image: ami-0735c191cf914754d (Ubuntu 22.04 LTS)
      Storage:
        Type: gp3
        Size: 20 GB
      Count: 2
      Subnets:
        - subnet-0ed0f7d900f687231 (Private 2a)
        - subnet-0be2078d20cec6ee8 (Private 2b)
      Security:
        Group: launch-sg-pool (sg-08d3c11d4fde25f8a)
      IAM:
        Role: launch-role-pool-service (AROAYWBJYCWLFRK2EJ2XC)
        Policy: launch-policy-pool-service (ANPAYWBJYCWLCPP7YPNDW)
        InstanceProfile: launch-profile-pool-service (AIPAYWBJYCWLFJBNT3N2C)
      Configuration:
        MaxClientConn: 2000
        DefaultPoolSize: 100
        MinPoolSize: 10
        ReservePoolSize: 50
        MaxDBConnections: 100
        MaxUserConnections: 100
      Status: Launch template created

Credentials:
  Storage:
    - Name: /launch/db/credentials
      ARN: arn:aws:secretsmanager:us-west-2:597088015766:secret:/launch/db/credentials-8kPXvh
      Description: "Database credentials for launch"

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

Enhanced Monitoring:
  Metrics:
    - OS processes
    - RDS processes
    - Memory usage
    - Disk I/O
  Interval: 15 seconds
  Role: launch-role-db-monitoring

Performance Insights:
  Retention: 7 days
  Aggregation: Hour
  Metrics:
    - db.load.avg
    - db.load.max
    - db.sessions.active
```

## Core Components

### 1. Database Infrastructure
- **PostgreSQL Configuration**
  ```yaml
  Database Infrastructure:
    Parameter Group:
      Name: launch-pg-main
      Family: postgres17
      ARN: arn:aws:rds:us-west-2:597088015766:pg:launch-pg-main
      Parameters:
        max_connections: 1000
        shared_buffers: 4GB
        effective_cache_size: 12GB
        maintenance_work_mem: 1GB
        checkpoint_completion_target: 0.9
        wal_buffers: 16MB
        default_statistics_target: 100
        random_page_cost: 1.1
        effective_io_concurrency: 200
        work_mem: 4MB
        min_wal_size: 1GB
        max_wal_size: 4GB
        max_worker_processes: 8
        max_parallel_workers_per_gather: 4
        max_parallel_workers: 8
        max_parallel_maintenance_workers: 4
      Status: Created

  Implementation Progress:
    1. RDS Instance:
      - Status: Modifying to POC specifications
      - Changes in progress:
        * Scaling down to db.t4g.medium
        * Disabling Multi-AZ
        * Reducing backup retention to 7 days
      - Parameter Group: Applying changes
      - Next Steps: Wait for modifications to complete
    2. Read Replicas:
      - Status: Not required for POC
      - Next Steps: None (removed from POC scope)

    Current Issues:
      - Instance modification in progress
      - Parameter group changes pending
      - Reduced specifications for POC environment

    Next Steps:
      1. Wait for instance modifications to complete
      2. Verify POC performance metrics
      3. Configure monitoring for POC workload
      4. Document upgrade path for production

    Note: This is a POC (Proof of Concept) configuration optimized for cost efficiency. For production deployment, the following upgrades would be recommended:
      - Upgrade to db.r6g.xlarge or appropriate instance class based on workload
      - Enable Multi-AZ for high availability
      - Increase backup retention to 35 days
      - Configure read replicas if required
      - Implement comprehensive monitoring
  ```

- **Schema Management**
  ```yaml
  Migration Framework:
    Tool: Flyway
    Version: 9.x
    Configuration:
      Locations:
        - filesystem:/migrations
        - classpath:db/migration
      BaselineOnMigrate: true
      ValidateOnMigrate: true
      CleanDisabled: true
      OutOfOrder: false
    Naming:
      Pattern: V{version}__{description}
      Example: V1_0_0__initial_schema.sql
  ```

### 2. Data Access Layer
- **Connection Management**
  ```typescript
  interface ConnectionConfig {
    poolConfig: {
      min: 10,
      max: 100,
      idleTimeoutMs: 60000,
      acquireTimeoutMs: 5000,
      createTimeoutMs: 5000,
      createRetryIntervalMs: 200,
      maxUses: 7200, // 2 hours
    },
    readConfig: {
      commandTimeout: 10000,
      statementTimeout: 30000,
      idleInTransactionTimeout: 60000,
    },
    writeConfig: {
      commandTimeout: 30000,
      statementTimeout: 60000,
      idleInTransactionTimeout: 60000,
    }
  }
  ```

### 3. Multi-tenant Data Model
- **Core Entities**
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

  -- Row Level Security Policy
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

  -- Audit Log with Partitioning
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

  -- Create monthly partitions
  CREATE TABLE audit_log_y2024m04 PARTITION OF audit_log
      FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

  -- Indexes
  CREATE INDEX idx_audit_tenant_date ON audit_log (tenant_id, performed_at);
  CREATE INDEX idx_audit_entity ON audit_log (entity_id, entity_type);
  ```

### 4. Data Access Patterns
- **Query Patterns**
  ```typescript
  interface QueryContext {
    tenantId: UILD;
    userId: UILD;
    permissions: string[];
    filters: Record<string, any>;
    pagination: {
      offset: number;
      limit: number;
    };
    sorting: {
      field: string;
      direction: 'ASC' | 'DESC';
    };
    options: {
      useReadReplica?: boolean;
      consistencyLevel?: 'strong' | 'eventual';
      timeout?: number;
    };
  }

  interface QueryMetrics {
    executionTime: number;
    rowCount: number;
    cacheHit: boolean;
    planningTime: number;
    waitTime: number;
  }
  ```

## Implementation Steps

### Layer-02 Phase-01: Database Infrastructure Setup
- [ ] Configure PostgreSQL cluster
  - [ ] Create DB subnet group
  - [ ] Configure security groups
  - [ ] Set up parameter group
  - [ ] Enable encryption
  - [ ] Configure monitoring
- [ ] Set up replication
  - [ ] Configure Multi-AZ
  - [ ] Set up read replicas
  - [ ] Configure failover
- [ ] Configure connection pooling
  - [ ] Deploy PgBouncer
  - [ ] Configure pools
  - [ ] Set up monitoring
- [ ] Implement monitoring
  - [ ] Enable Enhanced Monitoring
  - [ ] Configure Performance Insights
  - [ ] Set up CloudWatch alarms
- [ ] Establish backup procedures
  - [ ] Configure automated backups
  - [ ] Set up S3 exports
  - [ ] Test recovery procedures

### Layer-02 Phase-02: Schema Management System
- [ ] Design base schema structure
  - [ ] Create tenant management schema
  - [ ] Implement base entity template
  - [ ] Set up audit logging
  - [ ] Configure partitioning
- [ ] Implement migration framework
  - [ ] Set up Flyway configuration
  - [ ] Create baseline migration
  - [ ] Configure version tracking
  - [ ] Test migration process
- [ ] Create schema versioning
  - [ ] Implement version table
  - [ ] Set up change tracking
  - [ ] Configure rollback scripts
- [ ] Set up validation rules
  - [ ] Implement schema validation
  - [ ] Create constraint checks
  - [ ] Configure data validation
- [ ] Configure rollback mechanisms
  - [ ] Create rollback procedures
  - [ ] Test recovery process
  - [ ] Document rollback steps

### Layer-02 Phase-03: Multi-tenant Data Isolation
- [ ] Implement schema separation
  - [ ] Create tenant schemas
  - [ ] Set up isolation boundaries
  - [ ] Configure access controls
- [ ] Set up tenant routing
  - [ ] Implement connection routing
  - [ ] Configure session management
  - [ ] Set up tenant context
- [ ] Configure access controls
  - [ ] Implement RLS policies
  - [ ] Set up role permissions
  - [ ] Configure grant tables
- [ ] Establish data boundaries
  - [ ] Create partition schemes
  - [ ] Set up data segregation
  - [ ] Configure backup isolation
- [ ] Implement cross-tenant protections
  - [ ] Set up security barriers
  - [ ] Configure audit tracking
  - [ ] Implement access logging

### Layer-02 Phase-04: Data Access Layer Implementation
- [ ] Create connection pool manager
  - [ ] Configure PgBouncer pools
  - [ ] Set up connection limits
  - [ ] Implement failover logic
  - [ ] Configure monitoring
- [ ] Implement query builder
  - [ ] Create query templates
  - [ ] Set up parameter binding
  - [ ] Implement query cache
  - [ ] Configure query logging
- [ ] Set up transaction management
  - [ ] Implement transaction scope
  - [ ] Configure isolation levels
  - [ ] Set up savepoints
  - [ ] Handle deadlocks
- [ ] Configure error handling
  - [ ] Implement retry logic
  - [ ] Set up error logging
  - [ ] Configure alerts
  - [ ] Handle timeouts
- [ ] Establish retry mechanisms
  - [ ] Configure backoff strategy
  - [ ] Set up circuit breakers
  - [ ] Implement fallbacks
  - [ ] Monitor retry metrics

### Layer-02 Phase-05: Query Optimization Framework
- [ ] Design indexing strategy
  - [ ] Analyze query patterns
  - [ ] Create index plan
  - [ ] Implement auto-indexing
  - [ ] Monitor index usage
- [ ] Implement query caching
  - [ ] Configure cache layers
  - [ ] Set up invalidation
  - [ ] Monitor hit rates
  - [ ] Optimize cache size
- [ ] Set up query monitoring
  - [ ] Track execution times
  - [ ] Monitor resource usage
  - [ ] Configure alerts
  - [ ] Generate reports
- [ ] Configure query logging
  - [ ] Set up log rotation
  - [ ] Configure log levels
  - [ ] Implement parsing
  - [ ] Create dashboards
- [ ] Establish performance baselines
  - [ ] Create benchmarks
  - [ ] Set up monitoring
  - [ ] Configure alerts
  - [ ] Document standards

### Layer-02 Phase-06: Audit System Implementation
- [ ] Create audit logging framework
  - [ ] Set up audit tables
  - [ ] Configure triggers
  - [ ] Implement logging
  - [ ] Set up archival
- [ ] Implement change tracking
  - [ ] Track data changes
  - [ ] Record user actions
  - [ ] Monitor schema changes
  - [ ] Log security events
- [ ] Set up audit queries
  - [ ] Create audit views
  - [ ] Implement reporting
  - [ ] Configure exports
  - [ ] Set up dashboards
- [ ] Configure retention policies
  - [ ] Set retention periods
  - [ ] Implement archival
  - [ ] Configure cleanup
  - [ ] Monitor storage
- [ ] Establish compliance reporting
  - [ ] Create report templates
  - [ ] Set up scheduling
  - [ ] Configure alerts
  - [ ] Document procedures

## Success Criteria

### Performance Metrics
```yaml
Query Response Time:
  Target: < 100ms for 95% of queries
  Measurement:
    - Average response time
    - 95th percentile
    - 99th percentile
  Monitoring:
    - CloudWatch metrics
    - Performance Insights
    - Custom dashboards

Connection Pool Efficiency:
  Target: > 95%
  Metrics:
    - Pool utilization
    - Wait time
    - Timeout rate
    - Connection lifetime
  Alerts:
    - Pool exhaustion
    - High wait times
    - Connection leaks

Tenant Isolation:
  Target: Zero data leaks
  Validation:
    - RLS policy tests
    - Access control audits
    - Security scanning
  Monitoring:
    - Policy violations
    - Access attempts
    - Security events

Backup Recovery:
  Target: < 1 hour
  Components:
    - Full backup restore
    - Point-in-time recovery
    - Transaction logs
  Testing:
    - Monthly recovery tests
    - Failover validation
    - Data integrity checks

Schema Migration:
  Target: < 5 minutes
  Metrics:
    - Migration duration
    - Rollback time
    - Data validation
  Monitoring:
    - Migration status
    - Schema version
    - Error rates
```

### Reliability Metrics
```yaml
Database Uptime:
  Target: 99.99%
  Monitoring:
    - Instance status
    - Replication lag
    - Failover events
  Alerts:
    - Instance health
    - Connection errors
    - Performance degradation

Data Integrity:
  Target: Zero data loss
  Validation:
    - Checksum verification
    - Replication checks
    - Backup validation
  Monitoring:
    - Corruption detection
    - Transaction logs
    - Backup status

Failover Testing:
  Requirements:
    - Automated testing
    - Manual validation
    - Documentation
  Success Criteria:
    - < 60 second failover
    - Zero data loss
    - Automatic recovery

Audit Traceability:
  Requirements:
    - Complete audit trail
    - User attribution
    - Change tracking
  Validation:
    - Audit log integrity
    - Event correlation
    - Report accuracy

Data Isolation:
  Requirements:
    - Tenant separation
    - Access controls
    - Backup isolation
  Validation:
    - Security testing
    - Penetration testing
    - Compliance audits
```

## Dependencies
```yaml
PostgreSQL:
  Version: 14.10
  Extensions:
    - pg_stat_statements
    - pg_partman
    - pg_audit
    - pg_repack
    - timescaledb
  Configuration:
    - Custom parameter group
    - Optimized settings
    - Monitoring enabled

Connection Pooling:
  System: PgBouncer
  Version: 1.18
  Configuration:
    - Pool modes
    - Connection limits
    - SSL settings
  Monitoring:
    - Status metrics
    - Pool statistics
    - Connection tracking

Migration Framework:
  Tool: Flyway
  Version: 9.x
  Features:
    - Version control
    - Rollback support
    - Validation
  Integration:
    - CI/CD pipeline
    - Automated testing
    - Version tracking

Monitoring Tools:
  CloudWatch:
    - Enhanced monitoring
    - Custom metrics
    - Log insights
  Performance Insights:
    - Query analysis
    - Resource tracking
    - Trend monitoring
  Custom:
    - Prometheus
    - Grafana
    - Alert manager

Backup Solution:
  AWS Backup:
    - Automated snapshots
    - Cross-region copy
    - Retention management
  Custom:
    - Logical backups
    - Transaction logs
    - Point-in-time recovery
```

## Security Measures
```yaml
Row-level Security:
  Implementation:
    - Tenant isolation
    - User context
    - Policy enforcement
  Validation:
    - Security testing
    - Access auditing
    - Compliance checks

Tenant Isolation:
  Mechanisms:
    - Schema separation
    - Connection routing
    - Access controls
  Monitoring:
    - Policy violations
    - Access attempts
    - Security events

Access Control:
  Framework:
    - Role-based access
    - Permission grants
    - Context validation
  Management:
    - Role hierarchy
    - Permission matrix
    - Audit logging

Audit Logging:
  Configuration:
    - Transaction logging
    - DDL tracking
    - Security events
  Storage:
    - Partitioned tables
    - Archival process
    - Retention policy

Encryption:
  At Rest:
    - KMS integration
    - Key rotation
    - Backup encryption
  In Transit:
    - SSL enforcement
    - Certificate management
    - Protocol security
```

## Performance Optimizations
```yaml
Query Level:
  Indexing:
    - Automated analysis
    - Usage monitoring
    - Maintenance plan
  Optimization:
    - Query planning
    - Resource allocation
    - Cache utilization
  Monitoring:
    - Execution metrics
    - Resource usage
    - Performance trends

Data Level:
  Partitioning:
    - Time-based
    - Tenant-based
    - Hybrid approach
  Views:
    - Materialized views
    - Refresh strategy
    - Index optimization
  Caching:
    - Query results
    - Metadata
    - Connection pools
```

## Monitoring and Alerts
```yaml
System Metrics:
  Infrastructure:
    - CPU utilization
    - Memory usage
    - Disk I/O
    - Network traffic
  Database:
    - Connection count
    - Transaction rate
    - Cache hit ratio
    - Lock statistics

Query Metrics:
  Performance:
    - Execution time
    - Row count
    - Plan analysis
    - Resource usage
  Problems:
    - Slow queries
    - Blocked queries
    - Dead tuples
    - Index bloat

Alert Configuration:
  Critical:
    - High CPU (> 80%)
    - Low storage (< 20%)
    - Connection spikes
    - Replication lag
  Warning:
    - Slow queries
    - Cache misses
    - Lock contention
    - Index inefficiency
```

## Rollback Strategy
```yaml
Schema Version Control:
  Management:
    - Version tracking
    - Change history
    - Dependencies
  Rollback:
    - Automated scripts
    - Manual procedures
    - Data preservation

Point-in-time Recovery:
  Configuration:
    - Recovery window
    - Backup frequency
    - Log retention
  Process:
    - Snapshot restore
    - Log replay
    - Data validation

Transaction Management:
  Control:
    - Savepoints
    - Nested transactions
    - Distributed transactions
  Recovery:
    - Automatic rollback
    - Manual intervention
    - Data consistency

Backup Strategy:
  Types:
    - Full backups
    - Incremental backups
    - Transaction logs
  Storage:
    - S3 integration
    - Cross-region copy
    - Encryption

Emergency Procedures:
  Scenarios:
    - Data corruption
    - Performance issues
    - Security breaches
  Response:
    - Immediate actions
    - Communication plan
    - Recovery steps
```

## Documentation Requirements
```yaml
Schema Documentation:
  Content:
    - Entity relationships
    - Constraints
    - Indexes
    - Partitioning
  Format:
    - Markdown
    - Diagrams
    - Version history

API Documentation:
  Interfaces:
    - Query patterns
    - Error handling
    - Transaction management
  Examples:
    - Common queries
    - Best practices
    - Anti-patterns

Security Protocols:
  Policies:
    - Access control
    - Encryption
    - Audit requirements
  Procedures:
    - Security reviews
    - Incident response
    - Compliance checks

Backup Procedures:
  Process:
    - Backup schedule
    - Verification steps
    - Retention policy
  Recovery:
    - Restore procedures
    - Testing schedule
    - Validation steps

Recovery Plans:
  Scenarios:
    - Instance failure
    - Data corruption
    - Security breach
  Procedures:
    - Response steps
    - Contact list
    - Validation checks
``` 