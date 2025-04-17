import React, { createContext, useContext, useEffect, useState } from 'react'
import { TenantService } from '@/services/tenant/TenantService'
import type { TenantRecord } from '@/services/tenant/TenantService'

interface TenantContextType {
  tenant: TenantRecord | null
  isLoading: boolean
  error: Error | null
  reloadTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadTenant = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get subdomain from current hostname
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      // Load tenant data
      const tenantData = await TenantService.getInstance().loadTenant(subdomain)
      setTenant(tenantData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tenant'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTenant()
  }, [])

  const reloadTenant = async () => {
    await loadTenant()
  }

  const value = {
    tenant,
    isLoading,
    error,
    reloadTenant
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// Hook to ensure tenant is loaded before rendering children
export function withTenant<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithTenantComponent(props: P) {
    const { tenant, isLoading, error } = useTenant()

    if (isLoading) {
      return <div>Loading tenant...</div> // Replace with proper loading component
    }

    if (error) {
      return <div>Error: {error.message}</div> // Replace with proper error component
    }

    if (!tenant) {
      return <div>No tenant found</div> // Replace with proper not found component
    }

    return <WrappedComponent {...props} />
  }
} 