import { useAuth as useRealAuth } from './auth-context'
import { useMockAuth } from '@/contexts/AuthContext'

export function useAuth() {
  const isDevelopment = import.meta.env.MODE === 'development'
  
  // In development, use mock auth
  if (isDevelopment) {
    return useMockAuth()
  }
  
  // In production, use real auth
  return useRealAuth()
}

// Export the type from the real auth context to maintain consistency
export type { AuthContextType } from './auth-context' 