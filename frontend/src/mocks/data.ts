import { UILD } from '@/lib/uild'

// Generate persistent UILDs for development
const MOCK_UILDS = {
  samuraiTenant: 'tn_1649836800000_samura',  // Fixed UILD for samurai tenant
  demoTenant: 'tn_1649836800000_demote',     // Fixed UILD for demo tenant
  samuraiUser: 'us_1649836800000_adminu',    // Fixed UILD for admin user
  demoUser: 'us_1649836800000_demous',       // Fixed UILD for demo user
}

// Mock user data with consistent UILDs
export const mockUsers = [
  {
    id: MOCK_UILDS.samuraiUser,
    email: 'admin@tokyoflo.com',
    name: 'Admin User',
    tenantUild: MOCK_UILDS.samuraiTenant,
    roles: ['global-admin', 'tenant-admin'],
    subscription: {
      plan: 'enterprise',
      features: ['dashboard', 'crm', 'erp', 'tenant-management'],
      limits: {
        users: 999,
        storage: 999999
      }
    }
  },
  {
    id: MOCK_UILDS.demoUser,
    email: 'user@demo.tokyoflo.com',
    name: 'Demo User',
    tenantUild: MOCK_UILDS.demoTenant,
    roles: ['tenant-user'],
    subscription: {
      plan: 'standard',
      features: ['dashboard', 'crm', 'erp'],
      limits: {
        users: 10,
        storage: 5120
      }
    }
  }
]

// Access control matrix
export const accessMatrix = {
  'global-admin': {
    features: ['*'],
    permissions: ['*'],
    management: ['tenants', 'users', 'infrastructure']
  },
  'tenant-admin': {
    features: ['dashboard', 'settings', 'users'],
    permissions: ['manage_users', 'manage_settings'],
    management: ['users', 'settings']
  },
  'tenant-user': {
    features: ['dashboard', 'crm', 'erp'],
    permissions: ['view_dashboard', 'use_crm', 'use_erp'],
    management: []
  }
}

// Helper function to generate session UILD
export function generateSessionUild(userId: string, tenantUild: string): string {
  return UILD.generate('session', { 
    user: userId,
    tenant: tenantUild,
    timestamp: Date.now()
  })
}

// Helper function to validate tenant UILD
export function validateTenantUild(uild: string): boolean {
  return UILD.isValid(uild) && 
         UILD.getPrefix(uild) === UILD.PREFIXES.tenant &&
         (uild === MOCK_UILDS.samuraiTenant || uild === MOCK_UILDS.demoTenant)
}

// Helper function to get user by email
export function getUserByEmail(email: string): typeof mockUsers[0] | undefined {
  return mockUsers.find(u => u.email === email)
}

// Helper function to get user by ID
export function getUserById(id: string): typeof mockUsers[0] | undefined {
  return mockUsers.find(u => u.id === id)
} 