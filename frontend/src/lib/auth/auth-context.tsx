import * as React from 'react'
import { apiClient } from '@/lib/api/client'
import { UILD } from '@/lib/uild'

interface User {
  id: string
  email: string
  name: string
  tenantUild: string
  subscription: {
    plan: string
    features: string[]
    limits: Record<string, number>
  }
  sessionUild: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  hasFeature: (feature: string) => boolean
  isSamuraiTenant: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | null>(null)
AuthContext.displayName = 'AuthContext'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState({
    isAuthenticated: Boolean(localStorage.getItem('auth_token')),
    user: null as User | null,
    isLoading: true,
  })

  React.useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('auth_token')) {
        try {
          const user = await apiClient.getCurrentUser()
          setState(prev => ({ 
            ...prev, 
            isAuthenticated: true,
            user, 
            isLoading: false 
          }))
        } catch (error) {
          localStorage.removeItem('auth_token')
          setState(prev => ({ 
            ...prev, 
            isAuthenticated: false, 
            user: null, 
            isLoading: false 
          }))
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      setState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
      })
      return response
    } catch (error) {
      localStorage.removeItem('auth_token')
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      })
      throw error
    }
  }

  const logout = async () => {
    await apiClient.logout()
    localStorage.removeItem('auth_token')
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })
  }

  const hasFeature = React.useCallback((feature: string) => {
    if (!state.user) return false
    return state.user.subscription.features.includes(feature)
  }, [state.user])

  const isSamuraiTenant = React.useMemo(() => {
    if (!state.user) return false
    const isValidUild = UILD.isValid(state.user.tenantUild)
    const isTenantUild = isValidUild && UILD.getPrefix(state.user.tenantUild) === UILD.PREFIXES.tenant
    return isTenantUild && state.user.subscription.features.includes('tenant-management')
  }, [state.user])

  if (state.isLoading) {
    const loadingUild = UILD.generate('loading', { type: 'auth' })
    return (
      <div className="flex items-center justify-center min-h-screen" data-uild={loadingUild}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const value = React.useMemo(() => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    hasFeature,
    isSamuraiTenant,
    login,
    logout,
  }), [state.isAuthenticated, state.user, hasFeature, isSamuraiTenant])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth, type AuthContextType } 