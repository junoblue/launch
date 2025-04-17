import { UILD } from '../../lib/uild'

export interface TenantStatus {
  type: 'active' | 'pending' | 'disabled'
  lastUpdated: string
  updatedBy: string  // UILD of user/system that updated status
}

export interface TenantRecord {
  uild: string
  name: string
  subdomain: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
  settings: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    features: {
      ecommerce: boolean
      crm: boolean
      erp: boolean
      accounting: boolean
    }
  }
}

export class TenantService {
  private static instance: TenantService
  private baseUrl: string

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
  }

  static getInstance(): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService()
    }
    return TenantService.instance
  }

  private checkCurrentTenant() {
    const hostname = window.location.hostname
    const subdomain = this.extractSubdomain(hostname)
    
    if (subdomain && subdomain !== 'login' && subdomain !== 'signup' && subdomain !== 'samurai') {
      this.loadTenant(subdomain)
    }
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.')
    if (parts.length > 2) {
      return parts[0]
    }
    return null
  }

  async loadTenant(subdomain: string): Promise<TenantRecord> {
    try {
      const response = await fetch(`${this.baseUrl}/tenants/${subdomain}`)
      if (!response.ok) {
        throw new Error(`Failed to load tenant: ${response.statusText}`)
      }

      const data = await response.json()
      if (!data.uild || !UILD.isValid(data.uild) || UILD.getPrefix(data.uild) !== 'TENANT') {
        throw new Error('Invalid tenant UILD')
      }

      return data as TenantRecord
    } catch (error) {
      console.error('Error loading tenant:', error)
      throw error
    }
  }

  async updateTenantSettings(uild: string, settings: Partial<TenantRecord['settings']>): Promise<TenantRecord> {
    if (!UILD.isValid(uild) || UILD.getPrefix(uild) !== 'TENANT') {
      throw new Error('Invalid tenant UILD')
    }

    try {
      const response = await fetch(`${this.baseUrl}/tenants/${uild}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings })
      })

      if (!response.ok) {
        throw new Error(`Failed to update tenant settings: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating tenant settings:', error)
      throw error
    }
  }

  async createTenant(name: string, subdomain: string): Promise<TenantRecord> {
    try {
      const newTenant: Omit<TenantRecord, 'uild' | 'createdAt' | 'updatedAt'> = {
        name,
        subdomain,
        status: 'active',
        settings: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          features: {
            ecommerce: true,
            crm: true,
            erp: true,
            accounting: true
          }
        }
      }

      const response = await fetch(`${this.baseUrl}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTenant,
          uild: UILD.generate('TENANT')
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create tenant: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating tenant:', error)
      throw error
    }
  }

  async createTenantSession(): Promise<string> {
    if (!this.currentTenantUild) {
      throw new Error('No active tenant')
    }

    const sessionUild = UILD.generate('session', {
      tenant: this.currentTenantUild,
      type: 'tenant'
    })

    try {
      const response = await fetch(`${this.baseUrl}/api/tenants/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantUild: this.currentTenantUild,
          sessionUild
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create tenant session')
      }

      return sessionUild
    } catch (error) {
      console.error('Failed to create tenant session:', error)
      throw error
    }
  }

  async trackTenantAction(action: string): Promise<string> {
    if (!this.currentTenantUild) {
      throw new Error('No active tenant')
    }

    const actionUild = UILD.generate('action', {
      tenant: this.currentTenantUild,
      type: action
    })

    try {
      const response = await fetch(`${this.baseUrl}/api/tenants/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantUild: this.currentTenantUild,
          actionUild,
          action
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to track tenant action')
      }

      return actionUild
    } catch (error) {
      console.error('Failed to track tenant action:', error)
      throw error
    }
  }

  getCurrentTenantUild(): string | null {
    return this.currentTenantUild
  }

  async validateSubdomain(subdomain: string): Promise<{
    valid: boolean
    reason?: string
  }> {
    // Subdomain rules
    const minLength = 3
    const maxLength = 63
    const validPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

    // Reserved subdomains
    const reserved = ['www', 'api', 'admin', 'login', 'signup', 'samurai']

    if (subdomain.length < minLength) {
      return { valid: false, reason: 'Subdomain too short' }
    }

    if (subdomain.length > maxLength) {
      return { valid: false, reason: 'Subdomain too long' }
    }

    if (!validPattern.test(subdomain)) {
      return { 
        valid: false, 
        reason: 'Subdomain can only contain lowercase letters, numbers, and hyphens' 
      }
    }

    if (reserved.includes(subdomain)) {
      return { valid: false, reason: 'Subdomain is reserved' }
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tenants/validate-subdomain/${subdomain}`)
      const { available } = await response.json()

      return {
        valid: available,
        reason: available ? undefined : 'Subdomain is already taken'
      }
    } catch (error) {
      console.error('Failed to validate subdomain:', error)
      throw error
    }
  }
}

export const tenantService = TenantService.getInstance() 