interface ApiError extends Error {
  status?: number;
  data?: any;
}

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private storage: Storage;

  constructor() {
    // In development, use relative URLs for MSW to intercept
    this.baseUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_APP_API_URL || '');
    this.storage = window.localStorage;
  }

  private getAuthToken(): string | null {
    return this.storage.getItem('auth_token');
  }

  private async handleResponse(response: Response) {
    console.log('Handling API response:', {
      url: response.url,
      status: response.status,
      ok: response.ok
    })
    
    const data = await response.json();
    console.log('Response data:', data)

    if (!response.ok) {
      console.error('API error response:', data)
      const error = new Error(data.message || 'API Error') as ApiError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  async fetch(endpoint: string, options: RequestOptions = {}) {
    const { requireAuth = true, ...init } = options;
    const headers = new Headers(init.headers);

    // Add default headers
    headers.set('Content-Type', 'application/json');

    // Add auth token if required
    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log('Making API request:', {
      url,
      method: init.method || 'GET',
      requireAuth,
      hasToken: Boolean(this.getAuthToken())
    })

    const response = await fetch(url, {
      ...init,
      headers
    });

    return this.handleResponse(response);
  }

  // Auth methods
  async login(email: string, password: string) {
    console.log('Attempting login for email:', email)
    
    const data = await this.fetch('/api/auth/login', {
      method: 'POST',
      requireAuth: false,
      body: JSON.stringify({ email, password })
    });

    console.log('Login response received:', {
      hasData: Boolean(data),
      hasToken: Boolean(data?.token),
      hasUser: Boolean(data?.user)
    })

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format');
    }

    if (!data.token || !data.user) {
      console.error('Invalid response data:', data)
      throw new Error('Invalid response data: missing token or user');
    }

    if (!data.user.tenantUild) {
      console.error('Invalid user data:', data.user)
      throw new Error('Invalid user data: missing tenant identifier');
    }

    console.log('Login successful, storing token')
    this.storage.setItem('auth_token', data.token);

    return data;
  }

  async logout() {
    await this.fetch('/api/auth/logout', {
      method: 'POST'
    });
    this.storage.removeItem('auth_token');
  }

  // User methods
  async getCurrentUser() {
    return this.fetch('/api/users/me');
  }

  // Tenant methods
  async getTenants() {
    return this.fetch('/api/tenants');
  }
}

export const apiClient = new ApiClient(); 