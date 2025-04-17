# Frontend Architecture Overview

## Purpose
Establish a scalable, maintainable, and consistent frontend architecture using React, shadcn, and Material UI components following Atomic Design principles (ATOM) for our multi-tenant SaaS application.

## Current Implementation Status

### Phase 0: EC2-Based Frontend Infrastructure
The frontend application is hosted on EC2 instances in a private subnet, served through nginx, with CloudFront as the CDN layer.

#### EC2 Configuration
```yaml
EC2 Instance:
  Subnet: Private
  Purpose: Frontend hosting
  WebServer: nginx
  StaticPath: /opt/launch/frontend
  HealthCheck:
    Path: /health
    Port: 80
    Protocol: HTTP
```

#### CloudFront Configuration
```yaml
Distribution:
  Origins:
    - Type: Custom (launch-origin-frontend)
      Domain: internal-launch-alb-frontend-1496026960.us-west-2.elb.amazonaws.com
    - Type: Custom (launch-origin-api)
      Domain: internal-launch-alb-api-1496026960.us-west-2.elb.amazonaws.com
    - Type: Custom (launch-origin-admin)
      Domain: internal-launch-alb-admin-577028544.us-west-2.elb.amazonaws.com
    - Type: Custom (launch-origin-public)
      Domain: internal-launch-alb-public-637903362.us-west-2.elb.amazonaws.com
  DefaultBehavior:
    Origin: launch-origin-frontend
    Methods: [GET, HEAD, OPTIONS]
    TTL:
      Min: 0
      Default: 86400
      Max: 31536000
  PathBehaviors:
    - Path: /api/*
      Origin: launch-origin-api
      Methods: [HEAD, DELETE, POST, GET, OPTIONS, PUT, PATCH]
    - Path: /admin/*
      Origin: launch-origin-admin
      Methods: [HEAD, DELETE, POST, GET, OPTIONS, PUT, PATCH]
  ErrorHandling:
    - ErrorCode: 403
      ResponseCode: 200
      ResponsePage: /index.html
    - ErrorCode: 404
      ResponseCode: 200
      ResponsePage: /index.html
  SSL:
    Certificate: arn:aws:acm:us-east-1:597088015766:certificate/e31733d4-f38f-46d3-84d8-4f5753c5b006
    MinimumProtocolVersion: TLSv1.2_2021
```

#### Current Stack
```typescript
{
  "frontend": {
    "framework": "React 18",
    "buildTool": "Vite",
    "language": "TypeScript",
    "hosting": {
      "infrastructure": {
        "hosting": "EC2 (Private Subnet)",
        "webServer": "nginx",
        "staticPath": "/opt/launch/frontend",
        "status": "active",
        "healthCheck": {
          "path": "/health",
          "interval": "30s",
          "timeout": "5s",
          "unhealthyThreshold": 2,
          "healthyThreshold": 3
        }
      },
      "cdn": {
        "provider": "CloudFront",
        "domain": "login.tokyoflo.com"
      }
    }
  }
}
```

### Phase 1: Component Implementation Progress

#### Completed Components
```yaml
Pages:
  CRM:
    status: "Active"
    features:
      - Basic layout structure
      - Card-based sections
      - UILD tracking
      - Responsive grid
      - Frame integration
      - Lazy loading
      - Error boundaries
      - Loading states
    sections:
      - Contacts
      - Leads
      - Opportunities
      - Recent Activities

  Dashboard:
    status: "Active"
    features:
      - Quick stats widget
      - UILD tracking
      - Responsive layout
      - Frame integration
      - Lazy loading
      - Error boundaries
      - Loading states

  eCommerce:
    status: "Active"
    features:
      - Orders section
      - Products section
      - Customers section
      - Analytics section
      - UILD tracking
      - Responsive grid
      - Frame integration
      - Lazy loading
      - Error boundaries
      - Loading states

  ERP:
    status: "Active"
    features:
      - Basic layout structure
      - UILD tracking
      - Responsive grid
      - Frame integration
      - Lazy loading
      - Error boundaries
      - Loading states
    sections:
      - Inventory
      - Manufacturing
      - Supply Chain
      - Resources

  Accounting:
    status: "Active"
    features:
      - Basic layout structure
      - UILD tracking
      - Responsive grid
      - Frame integration
      - Lazy loading
      - Error boundaries
      - Loading states
    sections:
      - General Ledger
      - Accounts Receivable
      - Accounts Payable
      - Reports

  Global:
    Dashboard:
      status: "Active"
      features:
        - System status monitoring
        - Tenant metrics
        - Resource usage tracking
        - Activity logs
        - UILD tracking
        - Frame integration
        - Lazy loading
        - Error boundaries
        - Loading states
    
    Tenants:
      status: "Active"
      features:
        - Tenant listing
        - Status indicators
        - User counts
        - Creation dates
        - Add tenant action
        - UILD tracking
        - Frame integration
        - Lazy loading
        - Error boundaries
        - Loading states

Templates:
  Frame:
    status: "Active"
    features:
      - Responsive layout
      - Header integration
      - Main content area
      - Tenant-based access control
      - UILD tracking
      - Container management
      - Consistent spacing
      - Background styling
      - Error boundaries
      - Loading states
    dependencies:
      - "@radix-ui/react-navigation-menu"
      - "lucide-react"
    tracking:
      - Layout UILD
      - Header UILD
      - Main section UILD
      - Error UILD
      - Loading UILD

  ShellLayout:
    status: "Active"
    features:
      - Consistent header
      - Navigation menu
      - Main content area
      - Footer section
      - Responsive design
    dependencies:
      - "@radix-ui/react-navigation-menu"
    tracking:
      - UILD implementation

  SetupWizard:
    status: "Active"
    features:
      - Multi-step setup flow
      - Progress tracking
      - UILD integration
      - Tenant configuration
    components:
      - BrandingSetup
      - TeamSetup
      - FeatureConfig
      - IntegrationSetup
    tracking:
      - Setup progress
      - Feature toggles
      - Team invites
      - Branding changes

Organisms:
  Header:
    status: "Active"
    features:
      - Logo display
      - Navigation menu
      - Search functionality
      - User navigation
    components:
      - MainNav
      - UserNav
      - Search

  SetupWizard:
    status: "Active"
    features:
      - Step navigation
      - Progress tracking
      - Data persistence
      - Action tracking
    components:
      - BrandingSetup
      - TeamSetup
      - FeatureConfig
      - IntegrationSetup

Molecules:
  MainNav:
    status: "Active"
    features:
      - Dynamic navigation links
      - Active state tracking
      - Admin/User mode switching
  
  UserNav:
    status: "Active"
    features:
      - User avatar
      - Dropdown menu
      - Action shortcuts
      - Logout functionality

  Setup:
    status: "Active"
    features:
      - Configuration cards
      - Status tracking
      - Action buttons
      - Progress indicators
    components:
      - BrandingSetup
      - TeamSetup
      - FeatureConfig

Atoms:
  Avatar:
    status: "Active"
    features:
      - Image support
      - Fallback display
      - Size variants
  
  Button:
    status: "Active"
    features:
      - Multiple variants
      - Size options
      - Icon support
  
  DropdownMenu:
    status: "Active"
    features:
      - Nested menus
      - Keyboard navigation
      - Custom triggers

  Input:
    status: "Active"
    features:
      - Text input
      - Search variant
      - Error states
```

#### Authentication Implementation
```yaml
Completed:
  - Authentication context
  - Protected routes
  - Login page implementation
  - Route guards
  - Session management
  - Two-layer access control:
    - Layer 1: Tenant-based routing (initial login)
    - Layer 2: Role-based access control (within tenant)
  - UILD tracking
  - API client implementation
  - Token management

Features:
  Access Control System:
    - Tenant-based initial routing:
      - Determines environment/instance access
      - Based on tenant UILD prefix
      - Handles subdomain routing
      - Controls initial redirect
    
    - Role-based permissions:
      - Controls feature access within tenant
      - Permission matrix per role
      - Feature-level access control
      - Module access management
  
  Login System:
    - Email/password authentication
    - Tenant identification
    - Role verification
    - Loading states
    - Error handling
    - Token storage
    - UILD tracking

Development Environment:
  Configuration:
    Service: Production Auth API
    Status: "Active"
    Test Accounts:
      Samurai Tenant:
        Email: admin@tokyoflo.com
        Access: 
          Tenant: Samurai tenant environment
          Roles: ["global-admin", "tenant-admin"]
          Features: All features
      Regular Tenant:
        Email: user@demo.tokyoflo.com
        Access:
          Tenant: Demo tenant environment
          Roles: ["tenant-user"]
          Features: Based on subscription
```

#### Routing Structure
```typescript
// Route Structure (Updated)
src/routes/
  ├── index.tsx              # Main router configuration with React Router v7 features
  ├── types.ts              # Route type definitions
  └── guards/               # Route protection utilities
      └── ProtectedRoute.tsx

// Route Organization (Current Implementation)
{
  auth: {
    "/login": "Login page with UILD tracking and error handling"
  },
  common: {
    "/dashboard": "Main dashboard with lazy loading",
    "/modules": {
      "/ecommerce": "eCommerce section with lazy loading",
      "/crm": "CRM section with lazy loading",
      "/erp": "ERP section with lazy loading",
      "/accounting": "Accounting section with lazy loading"
    }
  },
  global: {
    "/dashboard": "Global admin dashboard with lazy loading",
    "/tenants": "Tenant management with lazy loading"
  }
}

// Route Features (Updated)
- React Router v7 features enabled
- Lazy loading for all pages
- Route-based code splitting
- Authentication guards with role checks
- Role-based access control
- Layout integration (Frame template)
- UILD tracking on all pages
- Error boundaries with retry mechanism
- Loading states with UILD tracking
- Cache control headers
- Browser cache management
- Subdomain-based routing
- Development mode handling
```

### Development Progress

#### Completed
- [x] Basic project structure
- [x] Component directory organization (Atomic Design)
- [x] Authentication system
  - [x] Login form functionality
  - [x] Session management
  - [x] Protected route guards
  - [x] API client
  - [x] Role-based access
  - [x] Subdomain routing
- [x] Basic page components created and enhanced:
  - [x] Login page (auth/login.page.tsx)
  - [x] Common pages:
    - [x] Dashboard with lazy loading
    - [x] eCommerce with lazy loading
    - [x] CRM with lazy loading
    - [x] ERP with lazy loading
    - [x] Accounting with lazy loading
  - [x] Global admin pages:
    - [x] Dashboard with lazy loading
    - [x] Tenants list with lazy loading
- [x] UILD tracking implementation
- [x] Development environment setup
- [x] Path aliasing configuration
- [x] File naming conventions established
- [x] Error boundaries implementation
- [x] Loading states with UILD tracking
- [x] React Router v7 configuration
- [x] Cache control implementation

#### In Progress
- [ ] Component library integration
  - [ ] shadcn/ui setup
  - [ ] Tailwind configuration
  - [ ] Radix UI components

#### Pending
- [ ] User registration flow
- [ ] Password recovery system
- [ ] Tenant management system
- [ ] Real-time updates
- [ ] API integration
- [ ] Production deployment
- [ ] Testing implementation
- [ ] Documentation completion

### Next Steps (Prioritized)
1. [ ] Complete route configuration
   - [ ] Update index.tsx with all routes
   - [ ] Implement route guards
   - [ ] Set up subdomain routing
   - [ ] Add error boundaries

2. [ ] Implement authentication
   - [ ] Connect login form to API
   - [ ] Add session management
   - [ ] Implement protected routes
   - [ ] Add authentication context

3. [ ] Set up component library
   - [ ] Install and configure shadcn/ui
   - [ ] Create shared components
   - [ ] Implement design system
   - [ ] Add component documentation

4. [ ] Testing and Documentation
   - [ ] Set up testing framework
   - [ ] Write component tests
   - [ ] Complete documentation
   - [ ] Add usage examples

### Local Development
```yaml
Environment:
  Framework: Vite
  Port: 5173
  Hot Reload: Enabled
  UILD Tracking: Active

Configuration:
  Authentication:
    Type: Production Auth API
    Endpoints:
      - /api/auth/login
      - /api/auth/logout
      - /api/users/me
      - /api/tenants
    Test Accounts:
      Samurai Tenant:
        Email: admin@tokyoflo.com
        Access: Tenant management interface
      Regular Tenant:
        Email: user@demo.tokyoflo.com
        Access: Standard tenant interface
  API Endpoints: Production
  Assets: Local
  Environment: Development

Access:
  URL: http://localhost:5173
  Routes:
    - / (Login)
    - /setup
    - /app/* (Protected)
    - /admin/* (Protected)
```

### File Structure and Route Components

```typescript
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Avatar/
│   ├── molecules/
│   │   ├── MainNav/
│   │   └── UserNav/
│   ├── organisms/
│   │   └── Header/
│   └── templates/
│       └── Frame/
│           ├── Frame.tsx
│           └── index.tsx
└── pages/
    ├── auth/
    │   └── login.page.tsx        # Authentication routes
    ├── common/                   # Default routes for all tenants
    │   ├── dashboard/
    │   │   └── dashboard.page.tsx
    │   └── modules/             # Module routes available based on tenant subscription
    │       ├── ecommerce/
    │       │   └── ecommerce.page.tsx
    │       ├── crm/
    │       │   └── crm.page.tsx
    │       ├── erp/
    │       │   └── erp.page.tsx
    │       └── accounting/
    │           └── accounting.page.tsx
    └── global/                  # Routes only accessible to Samurai tenant (UILD-based access)
        ├── dashboard/
        │   └── global.dashboard.page.tsx
        └── tenants/
            └── global.tenants.list.page.tsx

```

### Routing and Access Control

1. **Initial Tenant-Based Routing**
   - Determines which environment/instance user can access
   - Based on tenant UILD prefix during login
   - Controls initial routing and subdomain access
   - Example: Samurai tenants route to admin dashboard

2. **Role-Based Access Control**
   - Controls feature access within tenant environment
   - Based on user roles and permissions
   - Granular control over module access
   - Permission matrix defines allowed actions

3. **Common Routes** (`/common/*`)
   - Available to authenticated users with appropriate roles
   - Module access determined by role permissions
   - Feature access controlled by permission matrix

4. **Management Routes** (`/tenants/*`)
   - Requires both Samurai tenant and admin role
   - Used for tenant management and settings
   - Access controlled by both tenant type and role

5. **Authentication Routes** (`/auth/*`)
   - Public routes for login/logout
   - Handles tenant identification
   - Initiates role verification
   - Manages appropriate redirects

### Tenant Routing

- Samurai tenant: Identified by tenant UILD prefix
- Other tenants: Identified by their tenant UILD
- Development: Configurable via environment variables

### Implementation Notes

- Access control is based on tenant UILD
- Module access determined by tenant subscription status
- All routes use lazy loading for optimal performance
- Each page component includes its own UILD tracking
- Tenant isolation through UILD-based boundaries

### Development Authentication Implementation
```yaml
Mock Service Worker (MSW):
  Status: "Active"
  Purpose: "Development-only authentication simulation"
  Implementation:
    Handlers:
      - /api/auth/login:
          Method: POST
          Features:
            - Email validation
            - Mock token generation
            - Role assignment
            - UILD generation for session
            - Tenant type determination
      - /api/auth/logout:
          Method: POST
          Features:
            - Token removal
            - Session cleanup
      - /api/users/me:
          Method: GET
          Features:
            - User profile simulation
            - Role verification
            - Tenant access validation
      - /api/tenants:
          Method: GET
          Features:
            - Tenant data simulation
            - Subscription status
            - Feature access control

  Mock Data Structure:
    Users:
      Admin:
        Email: "admin@tokyoflo.com"
        Password: "any (development only)"
        Tenant:
          Type: "samurai"
          UILD: "67e55044-10b1-426f-9247-bb680e5fe0c8"
        Roles: ["global-admin", "tenant-admin"]
        Features: ["*"]
        UILDs:
          Session: "session_{timestamp}_{random}"
          User: "user_{timestamp}_{random}"
          
      Demo:
        Email: "user@demo.tokyoflo.com"
        Password: "any (development only)"
        Tenant:
          Type: "regular"
          UILD: "tn_{timestamp}_regular_{random}"
        Roles: ["tenant-user"]
        Features: ["dashboard", "crm", "erp"]
        UILDs:
          Session: "session_{timestamp}_{random}"
          User: "user_{timestamp}_{random}"

  Authentication Flow:
    1. Login Request:
       - Validate email format
       - Generate mock tenant UILD
       - Create mock user profile
       - Generate session UILD
       - Set mock tokens
    
    2. Session Management:
       - Store mock token in localStorage
       - Store user profile with UILDs
       - Track session duration
       - Handle token refresh
    
    3. Request Interception:
       - Intercept API requests
       - Validate mock tokens
       - Check permissions
       - Generate appropriate responses
    
    4. Error Simulation:
       - Network errors
       - Authentication failures
       - Permission denials
       - Token expiration

  Development Features:
    UILD Tracking:
      - Generate unique UILDs for all entities
      - Track user interactions
      - Monitor page navigation
      - Log authentication events
    
    Hot Reload:
      - Preserve authentication state
      - Maintain session data
      - Keep mock tokens valid
    
    Debug Tools:
      - Console logging
      - State inspection
      - Error monitoring
      - Performance tracking

  Testing Scenarios:
    Admin Flow:
      1. Login as admin@tokyoflo.com
      2. Access global dashboard
      3. Manage tenants
      4. Access all features
    
    User Flow:
      1. Login as user@demo.tokyoflo.com
      2. Access tenant dashboard
      3. Use permitted modules
      4. Test feature restrictions
```