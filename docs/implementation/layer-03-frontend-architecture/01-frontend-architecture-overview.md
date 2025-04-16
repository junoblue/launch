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

#### Navigation System
The application now implements a navigation menu using Radix UI components:

```typescript
// Navigation Menu Implementation
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

// Component Structure
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Section</NavigationMenu.Trigger>
      <NavigationMenu.Content>Content</NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

Current navigation sections include:
- eCommerce
- CRM
- ERP
- Accounting

#### Component Progress
```yaml
Implemented:
  Templates:
    - ShellLayout:
        status: "Active"
        features:
          - Responsive navigation
          - Sticky header
          - Footer
          - Content container
        dependencies:
          - "@radix-ui/react-navigation-menu": "^1.1.4"
        styling:
          - Tailwind CSS
          - Custom transitions
          - Backdrop blur effects

In Progress:
  Atoms:
    - Button
    - Input
    - Typography
  Molecules:
    - SearchBar
    - FormField
  Organisms:
    - DataTable
    - Forms
```

### Infrastructure Status
Current infrastructure status and completed steps:

1. CloudFront Configuration ✓
   - [x] Multiple origins configured
   - [x] Custom headers for origin verification
   - [x] Path-based routing established
   - [x] SSL/TLS configuration complete
   - [x] Default origin set to EC2

2. EC2 Setup
   - [x] Instance launched in private subnet
   - [x] Security groups configured
   - [x] IAM roles assigned
   - [ ] nginx configuration
   - [ ] Health check endpoint
   - [ ] Static file serving

### Next Steps (Prioritized)
1. [ ] Complete nginx configuration on EC2
   - Configure static file serving
   - Set up health check endpoint
   - Configure logging and monitoring
   - Implement cache headers

2. [ ] Validate EC2 Setup
   - Test static file serving
   - Verify health checks
   - Check CloudFront integration
   - Monitor performance metrics

3. [ ] Optimize CloudFront Configuration
   - Fine-tune cache behaviors
   - Test failover scenarios
   - Monitor performance metrics
   - Set up real-time monitoring

### Implementation Plan

#### Phase 1: Project Setup and Dependencies
```yaml
Framework: React 18
Build Tool: Vite
Language: TypeScript
UI Libraries:
  - shadcn/ui
  - Tailwind CSS
  - Radix UI (via shadcn)
Development Tools:
  - ESLint
  - Prettier
  - Husky (Git hooks)
  - TypeScript strict mode
```

#### Phase 2: Atomic Design Implementation
```typescript
// 1. Atoms (Base Components)
src/components/atoms/
  ├── Button/
  │   ├── Button.tsx
  │   ├── Button.test.tsx
  │   └── Button.stories.tsx
  ├── Input/
  │   ├── Input.tsx
  │   └── types.ts
  ├── Typography/
  │   ├── Text.tsx
  │   ├── Heading.tsx
  │   └── types.ts
  └── Icon/
      ├── Icon.tsx
      └── IconRegistry.ts

// 2. Molecules (Composite Components)
src/components/molecules/
  ├── SearchBar/
  │   ├── SearchBar.tsx
  │   ├── SearchBar.test.tsx
  │   └── types.ts
  ├── FormField/
  │   ├── FormField.tsx
  │   └── types.ts
  ├── NavigationLink/
  │   ├── NavigationLink.tsx
  │   └── types.ts
  └── Setup/
      ├── Setup.tsx
      └── types.ts

// 3. Organisms (Complex Components)
src/components/organisms/
  ├── DataTable/
  │   ├── DataTable.tsx
  │   ├── Pagination.tsx
  │   └── types.ts
  ├── NavigationMenu/
  │   ├── NavigationMenu.tsx
  │   └── types.ts
  └── Forms/
      ├── LoginForm.tsx
      └── types.ts

// 4. Templates (Page Layouts)
src/components/templates/
  ├── Frame/
  │   ├── Frame.tsx            # Base layout with header and main content
  │   └── types.ts            # Frame component types
  ├── AuthLayout/
  │   ├── AuthLayout.tsx      # Layout for authentication pages
  │   └── types.ts
  └── AdminLayout/
      ├── AdminLayout.tsx     # Layout for admin pages
      └── types.ts

// Frame Template Structure
interface FrameProps {
  children: React.ReactNode    // Main content
  isGlobalAdmin?: boolean     // Toggle admin-specific UI
  className?: string         // Additional styling
  uild?: string             // Unique identifier for tracking
}

// Component Hierarchy
Frame/
  ├── Header (Organism)
  │   ├── Logo
  │   ├── MainNav (Molecule)
  │   │   └── Navigation Links
  │   ├── Search
  │   └── UserNav (Molecule)
  │       └── User Dropdown
  └── Main Content
      └── Container with spacing

// 5. Pages (Route Components)
src/pages/
  ├── auth/
  │   ├── login.tsx
  │   └── register.tsx
  ├── dashboard/
  │   ├── index.tsx
  │   └── settings.tsx
  ├── setup/
  │   └── index.tsx
  └── admin/
      ├── users.tsx
      └── tenants.tsx
```

#### Phase 3: Theme System
```typescript
// Theme Configuration
src/styles/
  ├── theme/
  │   ├── colors.ts
  │   ├── typography.ts
  │   ├── spacing.ts
  │   └── breakpoints.ts
  └── shadcn/
      ├── button.ts
      ├── input.ts
      └── card.ts

// Multi-tenant Theming
interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  brandColors: {
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    scale: Record<string, string>;
  };
}

// Theme Provider
const ThemeProvider: FC<{
  tenant: string;
  theme: TenantTheme;
  children: ReactNode;
}>;
```

#### Phase 4: State Management
```typescript
// Global State (Zustand)
interface GlobalState {
  tenant: TenantConfig;
  user: UserProfile;
  theme: ThemeConfig;
  settings: AppSettings;
}

// API Integration (React Query)
src/api/
  ├── hooks/
  │   ├── useUser.ts
  │   ├── useTenant.ts
  │   └── useSettings.ts
  └── mutations/
      ├── useUpdateUser.ts
      ├── useUpdateTenant.ts
      └── useUpdateSettings.ts
```

### Development Guidelines

#### 1. Component Structure
```typescript
// Component Template
interface ComponentProps {
  // Props with TypeScript types
}

const Component: FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Component logic
  return (
    // JSX with Tailwind classes
  );
};

// Export with displayName
Component.displayName = 'Component';
export default Component;
```

#### 2. Testing Strategy
```yaml
Unit Tests:
  - Jest
  - React Testing Library
  - MSW for API mocking
  
Integration Tests:
  - Cypress
  - Component testing
  - E2E flows

Visual Testing:
  - Storybook
  - Visual regression
  - Accessibility checks
```

#### 3. Performance Optimization
```typescript
// Code Splitting
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
  ssr: false
});

// Performance Monitoring
interface PerformanceMetrics {
  FCP: number;  // First Contentful Paint
  LCP: number;  // Largest Contentful Paint
  TTI: number;  // Time to Interactive
  TBT: number;  // Total Blocking Time
}
```

### Success Criteria

#### Technical Requirements
```yaml
Performance:
  - First Contentful Paint: < 1.5s
  - Time to Interactive: < 3.5s
  - Lighthouse Score: > 90
  - Bundle Size: < 250KB (initial)

Code Quality:
  - Test Coverage: > 80%
  - TypeScript Strict: Enabled
  - Zero ESLint Errors
  - Documented Components

Accessibility:
  - WCAG 2.1 Compliant
  - Keyboard Navigation
  - Screen Reader Support
  - Color Contrast: WCAG AAA
```

#### Implementation Checklist
```yaml
Phase 1:
  - [ ] Project scaffolding
  - [ ] Dependencies setup
  - [ ] Build configuration
  - [ ] Development tooling

Phase 2:
  - [ ] Atomic components
  - [ ] Component documentation
  - [ ] Unit tests
  - [ ] Storybook setup

Phase 3:
  - [ ] Theme system
  - [ ] Multi-tenant support
  - [ ] Design tokens
  - [ ] Style guidelines

Phase 4:
  - [ ] State management
  - [ ] API integration
  - [ ] Performance optimization
  - [ ] Deployment pipeline
```

## Core Components

### 1. Atomic Design Structure
- **Atoms**
  ```tsx
  // Button Atom Example
  interface ButtonProps {
    variant: 'primary' | 'secondary' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    tenantTheme?: TenantThemeConfig;
    uildId: UILD;  // For tracking and analytics
  }
  ```

- **Molecules**
  ```tsx
  // SearchBar Molecule Example
  interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder: string;
    filters?: FilterConfig[];
    tenantId: UILD;
  }
  ```

- **Organisms**
  ```tsx
  // DataTable Organism Example
  interface DataTableProps<T> {
    data: T[];
    columns: ColumnConfig[];
    pagination: PaginationConfig;
    sorting: SortingConfig;
    tenantCustomizations: TenantUIConfig;
  }
  ```

- **Templates**
  ```tsx
  // Dashboard Template Example
  interface DashboardTemplateProps {
    layout: 'default' | 'compact' | 'custom';
    sidebar: SidebarConfig;
    header: HeaderConfig;
    tenantBranding: TenantBrandingConfig;
  }
  ```

### 2. Theme Integration
- **Base Theme Configuration**
  ```typescript
  interface ThemeConfig {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    typography: {
      fontFamily: string;
      scale: Record<string, string>;
    };
    spacing: Record<string, string>;
    breakpoints: Record<string, number>;
    shadows: Record<string, string>;
  }
  ```

### 3. Multi-tenant UI System
- **Tenant Configuration**
  ```typescript
  interface TenantUIConfig {
    theme: ThemeConfig;
    layout: LayoutConfig;
    features: FeatureFlags;
    branding: {
      logo: string;
      favicon: string;
      colors: BrandColors;
    };
    customCSS?: string;
  }
  ```

### 4. Component Library Integration
```typescript
// Component Registry
interface ComponentRegistry {
  atoms: Record<string, AtomicComponent>;
  molecules: Record<string, MolecularComponent>;
  organisms: Record<string, OrganismComponent>;
  templates: Record<string, TemplateComponent>;
}
```

## Implementation Steps

### Layer-03 Phase-01: Foundation Setup
- [x] Initialize React project with TypeScript
- [x] Configure build system (Vite)
- [x] Set up testing framework (Vitest)
- [x] Establish code quality tools (ESLint/Prettier)
- [x] Configure CI/CD pipeline
- [x] Implement base layout template

### Layer-03 Phase-02: Atomic Design System
- [x] Create atomic component structure
- [x] Set up navigation system
- [ ] Implement base atoms
- [ ] Build core molecules
- [ ] Develop key organisms
- [x] Design template layouts

### Layer-03 Phase-03: Theme Integration
- [ ] Set up shadcn configuration
- [ ] Integrate Material UI components
- [ ] Create theme provider
- [ ] Implement theme switching
- [ ] Build tenant theme manager

### Layer-03 Phase-04: Multi-tenant UI System
- [ ] Develop tenant configuration system
- [ ] Create tenant-aware components
- [ ] Implement tenant isolation
- [ ] Build tenant customization UI
- [ ] Set up tenant analytics

### Layer-03 Phase-05: State Management
- [ ] Configure global state management
- [ ] Implement tenant state handling
- [ ] Set up caching strategy
- [ ] Create state persistence
- [ ] Build state synchronization

### Layer-03 Phase-06: Performance Optimization
- [ ] Implement code splitting
- [ ] Set up lazy loading
- [ ] Configure caching
- [ ] Optimize bundle size
- [ ] Implement performance monitoring

## Success Criteria

### Performance Metrics
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Lighthouse score > 90
- [ ] Bundle size < 250KB (initial load)
- [ ] Zero tenant-specific memory leaks

### UI/UX Metrics
- [ ] Component reusability > 80%
- [ ] Design system coverage > 95%
- [ ] Accessibility score > 95
- [ ] Cross-browser compatibility 100%
- [ ] Responsive design verification

## Dependencies
- React 18+
- shadcn/ui
- Material UI
- TypeScript 5+
- Emotion/styled-components
- React Query/SWR

## Security Measures
- XSS prevention
- CSRF protection
- Content Security Policy
- Tenant data isolation
- Input sanitization

## Performance Optimizations
- **Component Level**
  - Memoization
  - Code splitting
  - Tree shaking
  - Virtual scrolling
  - Lazy loading

- **Asset Level**
  - Image optimization
  - Font subsetting
  - CSS optimization
  - Bundle splitting
  - Resource hints

## Monitoring and Analytics
- **Performance Metrics**
  - Core Web Vitals
  - Custom metrics
  - Error tracking
  - User flows
  - Resource timing

- **User Analytics**
  - Interaction tracking
  - Feature usage
  - Error reporting
  - Performance monitoring
  - A/B testing

## Testing Strategy
1. Unit tests (Jest)
2. Integration tests (Testing Library)
3. E2E tests (Cypress)
4. Visual regression tests
5. Accessibility tests

## Documentation Requirements
1. Component documentation
2. Theme customization guide
3. Tenant configuration guide
4. Performance guidelines
5. Security best practices 