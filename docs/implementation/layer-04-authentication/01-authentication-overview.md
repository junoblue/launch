# Authentication Layer Overview

> Last Updated: 2024-04-15
> Status: In Planning
> Priority: High

## Overview

This layer implements the authentication and authorization system for the Launch application, focusing on secure access control and user session management.

## Architecture Components

### 1. Authentication Service
- **Location**: EC2 Instance (shared with main backend)
- **Framework**: Flask + Flask-Login
- **Storage**: PostgreSQL (shared with main database)
- **Session Management**: Redis for token storage

### 2. Security Implementation
- JWT (JSON Web Tokens) for API authentication
- Secure password hashing using bcrypt
- HTTPS enforcement across all endpoints
- CORS configuration for frontend integration

### 3. Route Protection
```typescript
// Protected Route Implementation
interface ProtectedRouteProps {
  isAuthenticated: boolean     // User authentication status
  tenant: string              // Tenant UILD
  roles?: string[]            // Required roles for access
  children: React.ReactNode   // Route content
  requiredPermissions?: string[] // Required permissions
}

// Two-Layer Access Control Flow
1. Tenant-Based Layer (Initial)
   - Extract tenant UILD from login
   - Validate tenant status
   - Determine environment access
   - Handle subdomain routing
   - Set initial redirect path

2. Role-Based Layer (Post-Login)
   - Verify user roles
   - Check permission matrix
   - Control feature access
   - Manage module permissions
   - Handle role-specific redirects

3. Token Management
   - Verify JWT signature
   - Check token expiration
   - Validate token claims
   - Store tenant and role data
   - Handle refresh flow

// Security Features
- Two-layer access validation
- Role-based permission control
- Route-level audit logging
- Navigation tracking
- Token blacklisting
- Rate limiting
```

### 4. Integration Points
```typescript
// Frontend Authentication Service
interface AuthService {
  login(credentials: Credentials): Promise<AuthResponse>
  logout(): Promise<void>
  refreshToken(): Promise<AuthResponse>
  getCurrentUser(): Promise<User>
  hasPermission(permission: string): boolean
  hasRole(role: string): boolean
  getTenantAccess(): TenantAccess
}

// Access Control Types
interface TenantAccess {
  tenantUild: string
  type: 'samurai' | 'regular'
  environment: string
}

interface RoleAccess {
  roles: string[]
  permissions: string[]
  features: string[]
}

// Token Payload
interface TokenPayload {
  sub: string
  tenant: TenantAccess
  roles: RoleAccess
  exp: number
  iat: number
}

// Session Management
interface SessionManager {
  startSession(user: User, tenant: TenantAccess, roles: RoleAccess): Promise<void>
  endSession(): Promise<void>
  validateSession(): Promise<boolean>
  getSessionData(): Promise<SessionData>
}
```

### 6. Domain-Based Authentication
```typescript
// Domain Configuration
interface DomainConfig {
  type: 'tenant' | 'auth'
  domain: string
  features: string[]
}

const domainConfigs: Record<string, DomainConfig> = {
  'login.tokyoflo.com': {
    type: 'auth',
    domain: 'login.tokyoflo.com',
    features: ['authentication']
  },
  '*.tokyoflo.com': {
    type: 'tenant',
    domain: '*.tokyoflo.com',
    features: ['app']
  }
}

// Tenant Domain Management
interface TenantDomain {
  tenantUild: string        // UILD-based tenant identifier
  subdomain: string         // e.g., 'tn_timestamp_random.tokyoflo.com'
  vanityDomain?: string     // Optional vanity domain
  status: 'active' | 'pending' | 'disabled'
}

// Authentication Flow by Domain
1. Domain Recognition:
   - Extract tenant UILD from subdomain
   - Validate UILD format and type
   - Load tenant configuration
   - Set feature flags based on subscription

2. Tenant Access:
   - Universal login through login.tokyoflo.com
   - Tenant-specific access via UILD subdomain
   - Optional vanity domain support
   - Subscription-based feature access

3. New Tenant Registration:
   - Generate unique tenant UILD
   - Create initial subdomain using UILD
   - Setup tenant configuration
   - Initialize subscription settings

// Security Considerations
- UILD validation and verification
- Tenant isolation through UILD boundaries
- SSL certificate management (*.tokyoflo.com wildcard cert)
- Cross-subdomain security policies
```

### 7. Tenant Management
```typescript
// Access Control Matrix
const accessMatrix = {
  // Tenant Layer
  'samurai-tenant': {
    identifier: (uild: string) => uild.startsWith('tn_') && isSamuraiTenant(uild),
    environment: 'admin',
    baseUrl: '/admin'
  },
  'regular-tenant': {
    identifier: (uild: string) => uild.startsWith('tn_'),
    environment: 'app',
    baseUrl: '/dashboard'
  },
  
  // Role Layer
  'global-admin': {
    features: ['*'],
    management: ['tenants', 'subscriptions', 'users'],
    modules: ['*']
  },
  'tenant-admin': {
    features: ['dashboard', 'settings', 'users'],
    management: ['users', 'settings'],
    modules: ['crm', 'erp', 'accounting']
  },
  'tenant-user': {
    features: ['dashboard'],
    management: [],
    modules: ['crm', 'erp']
  }
}

// Permission Evaluation
const evaluateAccess = (user: User, resource: string): boolean => {
  // First layer: Check tenant access
  const tenantAccess = accessMatrix[user.tenantType]
  if (!tenantAccess) return false
  
  // Second layer: Check role permissions
  const roleAccess = user.roles.some(role => {
    const roleMatrix = accessMatrix[role]
    return roleMatrix?.features.includes(resource) || roleMatrix?.features.includes('*')
  })
  
  return roleAccess
}
```

### 8. UILD Integration for Multi-Tenant System
```typescript
// Tenant UILD Structure
interface TenantUILD {
  id: string                 // Base UILD for tenant
  type: 'tenant'
  metadata: {
    createdAt: string
    status: TenantStatus
    subscription: string
  }
}

// UILD-Based Access Control
interface TenantAccess {
  tenantUild: string
  sessionUild: string
  subscription: {
    plan: string
    features: string[]
    limits: Record<string, number>
  }
}

// Example Usage
const tenantManagement = {
  createTenant: async (name: string) => {
    const tenantUild = UILD.generate('tenant')
    const record: TenantRecord = {
      uild: tenantUild,
      name,
      subdomain: `${tenantUild}.tokyoflo.com`,
      status: 'active',
      created: {
        at: new Date().toISOString(),
        by: UILD.current()
      },
      subscription: {
        plan: 'standard',
        features: ['dashboard', 'crm', 'erp'],
        limits: {
          users: 10,
          storage: 5120 // MB
        }
      }
    }
    return record
  }
}
```

## Development Environment

### Authentication System
```yaml
Overview:
  Purpose: "Handle authentication and authorization in development"
  Technology: "Production Auth API"
  Status: "Active"

Implementation:
  API Integration:
    Location: src/lib/auth/auth-context.tsx
    Features:
      - API route handling
      - Response processing
      - Error handling
      - State management
    Endpoints:
      Authentication:
        - POST /api/auth/login
        - POST /api/auth/logout
        - GET /api/auth/refresh
      User Management:
        - GET /api/users/me
        - GET /api/users/permissions
      Tenant Access:
        - GET /api/tenants
        - GET /api/tenants/current

  Authentication:
    Token Format: JWT with UILD identifiers
    Storage: localStorage
    Expiration: 1 hour (configurable)
    Refresh: Enabled
    
  Test Accounts:
    Samurai Admin:
      Credentials:
        Email: admin@tokyoflo.com
      Access:
        Type: Samurai tenant
        Environment: Admin interface
        Roles: ["global-admin", "tenant-admin"]
      Features:
        - Full system access
        - Tenant management
        - User administration
        - All modules enabled
      UILDs:
        User: "8f7e6d5c-4b3a-2198-7654-321fedcba000"    # Example user UILD
        Session: "a2109bcd-67ef-4d23-95ab-12c3456d78e9"  # Example session UILD
        Tenant: "67e55044-10b1-426f-9247-bb680e5fe0c8"   # Example tenant UILD
    
    Demo User:
      Credentials:
        Email: user@demo.tokyoflo.com
      Access:
        Type: Regular tenant
        Environment: Standard interface
        Roles: ["tenant-user"]
      Features:
        - Dashboard access
        - CRM module
        - ERP module
        - Basic reporting
      UILDs:
        User: "12345678-90ab-cdef-1234-567890abcdef"    # Example user UILD
        Session: "5f8ee8b0-c156-4370-9a61-fb49d2381abc"  # Example session UILD
        Tenant: "89a12c56-3d23-4ab7-b084-1a2b3c4d5e6f"  # Example tenant UILD

Development Features:
  Authentication Flow:
    1. Login Process:
       - Email validation
       - Token validation
       - User profile retrieval
       - Role verification
       - UILD tracking
       - Session establishment
    
    2. Session Handling:
       - Token storage in localStorage
       - User data persistence
       - Role-based access control
       - Feature flag management
    
    3. Request Processing:
       - Token validation
       - Permission checking
       - Response handling
       - Error handling
    
    4. Development Tools:
       - Console logging
       - State inspection
       - Error monitoring
       - Authentication debugging

  UILD Implementation:
    Format: UILD
    Examples:
      Users: "8f7e6d5c-4b3a-2198-7654-321fedcba000"
      Sessions: "a2109bcd-67ef-4d23-95ab-12c3456d78e9"
      Tenants: "67e55044-10b1-426f-9247-bb680e5fe0c8"
      Records:
        Products: "782d5c99-eb32-48f1-a262-dd8f11d3bf5a"
        Contacts: "1a237d8c-49ef-4b30-8d42-e55c321f9876"

    Context:
      Each record includes its tenant UILD for isolation:
        Example Product:
          product_id: "782d5c99-eb32-48f1-a262-dd8f11d3bf5a"
          tenant_id: "67e55044-10b1-426f-9247-bb680e5fe0c8"
        
        Example Contact:
          contact_id: "1a237d8c-49ef-4b30-8d42-e55c321f9876"
          tenant_id: "89a12c56-3d23-4ab7-b084-1a2b3c4d5e6f"

Testing Capabilities:
  Scenarios:
    - Authentication flows
    - Permission checks
    - Role-based access
    - Error conditions
    - Token expiration
    - Session management
  
  Error Simulation:
    - Network failures
    - Authentication errors
    - Permission denials
    - Token invalidation
    - Session expiration

Development Guidelines:
  1. Use provided test accounts for specific scenarios
  2. Monitor console for authentication events
  3. Check UILD tracking in development tools
  4. Test both success and error paths
  5. Verify role-based access control
  6. Validate feature flag behavior
```

## Implementation Plan

### Phase 1: Core Authentication
1. User registration and login endpoints
2. Password reset functionality
3. Email verification system
4. Basic session management

### Phase 2: Authorization
1. Role-based access control (RBAC)
2. Permission management system
3. API endpoint protection
4. Admin user management

### Phase 3: Advanced Features
1. Multi-factor authentication
2. OAuth integration (if required)
3. Session audit logging
4. Security monitoring and alerts

## Security Considerations

1. **Password Security**
   - Minimum password requirements
   - Secure password reset flow
   - Brute force protection

2. **Session Security**
   - Token expiration and rotation
   - Secure cookie configuration
   - CSRF protection

3. **Infrastructure Security**
   - AWS security groups configuration
   - Network access control
   - Secrets management

## Monitoring and Logging

1. **Authentication Events**
   - Login attempts (success/failure)
   - Password resets
   - Account lockouts

2. **Security Alerts**
   - Multiple failed login attempts
   - Unusual access patterns
   - Token validation failures

## Testing Strategy

1. **Unit Tests**
   - Authentication logic
   - Password handling
   - Token management

2. **Integration Tests**
   - Login flow
   - Registration process
   - Password reset workflow

3. **Security Tests**
   - Penetration testing
   - Token security validation
   - Session management testing 

## Implementation Status

### Completed Features
```yaml
Core Authentication:
  - Authentication context
  - Token management
  - Session handling
  - Protected routes
  - Route guards
  - Subdomain routing
  - UILD tracking
  - JWT implementation
  - Token refresh flow
  - Token blacklisting
  - Setup wizard authentication
  - Tenant verification
  - Basic page protection
  - React Router v7 integration
  - Cache control implementation
  - Error boundaries
  - Loading states
  - Development mode handling

Route Protection:
  - Basic route protection
  - Admin route guards
  - Authentication checks
  - Role verification
  - Subdomain-based access control
  - JWT validation
  - Permission checks
  - Setup flow protection
  - Tenant-based access
  - Page-level UILD tracking
  - Error handling with retry
  - Loading state management
  - Cache control headers
  - Browser cache management

Components:
  - Login page structure
  - User navigation
  - Authentication provider
  - Protected route wrapper
  - SubdomainRouter
  - Action tracking hook
  - Token interceptor
  - Session manager
  - Setup wizard auth
  - Team management
  - Basic page components
  - Error boundaries
  - Loading fallbacks
  - Cache management
```

### Current Progress
```yaml
Phase 1: Core Authentication ✓
  - [x] User authentication context
  - [x] Protected route implementation
  - [x] Basic session management
  - [x] Login/logout functionality
  - [x] Subdomain routing
  - [x] UILD tracking
  - [x] JWT implementation
  - [x] Token refresh flow
  - [x] Setup wizard auth flow
  - [x] Basic page authentication
  - [x] Error boundaries
  - [x] Loading states
  - [x] Cache control

Phase 2: Authorization ✓
  - [x] Role-based route protection
  - [x] Admin access control
  - [x] Permission management system
  - [x] API endpoint protection
  - [x] Subdomain-based access control
  - [x] JWT validation
  - [x] Token blacklisting
  - [x] Setup flow permissions
  - [x] Page-level access control
  - [x] Error handling with retry
  - [x] Loading state management
  - [x] Cache management

Phase 3: Domain-Based Auth ✓
  - [x] Subdomain routing
  - [x] Tenant isolation
  - [x] Cross-subdomain security
  - [x] Setup domain handling
  - [x] Basic domain routing
  - [x] Development mode handling
  - [ ] Wildcard certificate setup

### Next Steps (Prioritized)
1. Security Enhancements
   - [ ] Add rate limiting
   - [ ] Implement audit logging
   - [ ] Set up security monitoring
   - [ ] Add breach detection
   - [ ] Complete wildcard certificate setup
   - [ ] Setup wizard session protection
   - [ ] Page-level security auditing

2. Analytics Integration
   - [x] Basic UILD tracking
   - [x] Error tracking with UILD
   - [x] Loading state tracking
   - [ ] Enhanced UILD tracking
   - [ ] Add performance metrics
   - [ ] Implement user flow tracking
   - [ ] Set up error tracking
   - [ ] Add usage analytics
   - [ ] Setup completion tracking
   - [ ] Page interaction analytics

3. Feature Completion
   - [x] Complete setup wizard flow
   - [x] Error handling implementation
   - [x] Loading state management
   - [ ] Add password recovery
   - [ ] Implement email verification
   - [ ] Add multi-factor authentication
   - [ ] Complete admin dashboard
   - [ ] Integration authentication

4. Tenant Management
   - [x] Build tenant dashboard
   - [x] Add user management
   - [x] Configure feature flags
   - [x] Basic error handling
   - [x] Loading state management
   - [ ] Set up usage monitoring
   - [ ] Integration management
   - [ ] Billing authentication

5. Performance Optimization
   - [x] Implement lazy loading
   - [x] Add error boundaries
   - [x] Optimize loading states
   - [x] Cache control implementation
   - [ ] Add rate limiting
   - [ ] Implement audit logging
   - [ ] Set up security monitoring
   - [ ] Add breach detection 