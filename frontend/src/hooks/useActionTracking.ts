import { useCallback } from 'react'
import { tenantService } from '../services/tenant/TenantService'
import { UILD } from '../lib/uild'

export const useActionTracking = () => {
  const trackAction = useCallback(async (action: string, metadata?: Record<string, unknown>) => {
    try {
      const actionUild = await tenantService.trackTenantAction(action)
      
      // Log the action with UILD for debugging
      console.debug(`Action tracked: ${action}`, {
        actionUild,
        metadata
      })

      return actionUild
    } catch (error) {
      console.error('Failed to track action:', error)
      throw error
    }
  }, [])

  return { trackAction }
} 