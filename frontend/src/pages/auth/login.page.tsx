import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UILD } from '@/lib/uild'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useMockAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const pageUild = UILD.generate('page', { type: 'login' })
  const formUild = UILD.generate('form', { type: 'login' })
  
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useMockAuth()
  const from = location.state?.from?.pathname || '/dashboard'
  
  const [formState, setFormState] = React.useState({
    email: '',
    password: '',
    error: null as string | null,
    isLoading: false
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    if (auth.isAuthenticated && !formState.isLoading) {
      navigate(from, { replace: true })
    }
  }, [auth.isAuthenticated, navigate, from, formState.isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, error: null, isLoading: true }))

    try {
      const response = await auth.login(formState.email, formState.password)
      
      if (!response?.user) {
        throw new Error('Login successful but user data not received')
      }
      
      // Let the effect handle the redirect
    } catch (err) {
      console.error('Login error:', err)
      setFormState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Login failed',
        password: ''
      }))
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div data-uild={pageUild} className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Launch</h1>
          <p className="mt-2 text-gray-600">Sign in to your tenant</p>
        </div>

        {formState.error && (
          <div 
            role="alert"
            aria-live="polite"
            className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          >
            {formState.error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="mt-8 space-y-6"
          data-uild={formUild}
          autoComplete="on"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email address</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username email"
                required
                value={formState.email}
                onChange={handleInputChange}
                disabled={formState.isLoading}
                aria-label="Email address"
                aria-required="true"
                aria-invalid={formState.error ? "true" : "false"}
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formState.password}
                onChange={handleInputChange}
                disabled={formState.isLoading}
                aria-label="Password"
                aria-required="true"
                aria-invalid={formState.error ? "true" : "false"}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formState.isLoading}
            aria-busy={formState.isLoading}
          >
            {formState.isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Development Mode Test Accounts:</p>
            <p>Admin: admin@tokyoflo.com</p>
            <p>User: user@demo.tokyoflo.com</p>
            <p className="text-xs text-gray-500 mt-1">(Any password will work)</p>
          </div>
        </form>
      </Card>
    </div>
  )
} 