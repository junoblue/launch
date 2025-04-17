import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UILD } from '../../lib/uild'
import { tenantService } from '../../services/tenant/TenantService'
import { useTenant } from '../../contexts/TenantContext'

interface SubdomainRouterProps {
  children: React.ReactNode
}

export const SubdomainRouter: React.FC<SubdomainRouterProps> = ({ children }) => {
  const navigate = useNavigate()
  const { tenant, isLoading, error } = useTenant()
  const [sessionUild, setSessionUild] = useState<string | null>(null)

  useEffect(() => {
    const handleSubdomainChange = async () => {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]

      // Skip if we're on the main domain or login/signup pages
      if (subdomain === 'www' || subdomain === 'login' || subdomain === 'signup') {
        return
      }

      try {
        // Create a new session UILD for this tenant visit
        const newSessionUild = await tenantService.createTenantSession()
        setSessionUild(newSessionUild)

        // Track the page view action
        await tenantService.trackTenantAction('page_view')
      } catch (err) {
        console.error('Failed to initialize tenant session:', err)
        // Redirect to login if there's an error
        navigate('/login')
      }
    }

    handleSubdomainChange()

    // Cleanup function to track session end
    return () => {
      if (sessionUild) {
        tenantService.trackTenantAction('session_end')
      }
    }
  }, [navigate, sessionUild])

  if (isLoading) {
    return <div>Loading tenant...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!tenant) {
    return <div>No tenant found</div>
  }

  return <>{children}</>
} 