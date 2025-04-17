import { http, HttpResponse } from 'msw'
import { 
  mockUsers, 
  accessMatrix, 
  generateSessionUild, 
  validateTenantUild,
  getUserByEmail,
  getUserById
} from './data'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    console.log('Mock login handler received request:', { email })
    
    const user = getUserByEmail(email)
    console.log('Found user:', user ? 'yes' : 'no')

    if (!user) {
      console.log('Login failed: User not found')
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!validateTenantUild(user.tenantUild)) {
      console.log('Login failed: Invalid tenant UILD:', user.tenantUild)
      return HttpResponse.json(
        { message: 'Invalid tenant configuration' },
        { status: 401 }
      )
    }

    const sessionUild = generateSessionUild(user.id, user.tenantUild)
    console.log('Generated session UILD:', sessionUild)

    const response = {
      token: `mock-jwt-${sessionUild}`,
      user: {
        ...user,
        sessionUild
      }
    }
    console.log('Sending login response:', response)

    return HttpResponse.json(response)
  }),

  http.post('/api/auth/logout', () => {
    console.log('Mock logout')
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  // User endpoints
  http.get('/api/users/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Unauthorized: No valid token')
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const userId = token.split('-')[1] // Extract user ID from token
    const user = getUserById(userId) || mockUsers[1] // Fallback to demo user

    if (!validateTenantUild(user.tenantUild)) {
      console.log('Invalid tenant UILD for user:', user.email)
      return HttpResponse.json(
        { message: 'Invalid tenant configuration' },
        { status: 401 }
      )
    }

    console.log('Current user:', user.email, 'Tenant:', user.tenantUild)
    return HttpResponse.json(user)
  }),

  // Role endpoints
  http.get('/api/users/me/roles', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const userId = token.split('-')[1]
    const user = getUserById(userId) || mockUsers[1]
    
    return HttpResponse.json({
      roles: user.roles,
      permissions: user.roles.flatMap(role => 
        accessMatrix[role as keyof typeof accessMatrix]?.permissions || []
      )
    })
  }),

  // Permission check endpoint
  http.get('/api/users/me/permissions/:permission', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    const { permission } = params
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const userId = token.split('-')[1]
    const user = getUserById(userId) || mockUsers[1]
    
    const hasPermission = user.roles.some(role => {
      const roleMatrix = accessMatrix[role as keyof typeof accessMatrix]
      return roleMatrix?.permissions.includes(permission as string) || 
             roleMatrix?.permissions.includes('*')
    })

    return HttpResponse.json({ hasPermission })
  }),

  // Tenant endpoints
  http.get('/api/tenants', () => {
    const tenants = mockUsers.map(user => ({
      uild: user.tenantUild,
      name: user.email.split('@')[1].split('.')[0].toUpperCase(),
      subscription: user.subscription,
      createdAt: new Date(UILD.getTimestamp(user.tenantUild)!).toISOString()
    }))

    return HttpResponse.json(tenants)
  })
] 