export type SubdomainType = 'global' | 'tenant' | 'auth';

const config = {
  baseDomain: import.meta.env.VITE_BASE_DOMAIN || 'tokyoflo.com',
  globalSubdomain: import.meta.env.VITE_GLOBAL_SUBDOMAIN || 'samurai',
  authSubdomain: import.meta.env.VITE_AUTH_SUBDOMAIN || 'login',
  devSubdomainType: import.meta.env.VITE_DEV_SUBDOMAIN_TYPE as SubdomainType,
  devTenantId: import.meta.env.VITE_DEV_TENANT_ID || 'dev-tenant'
};

export function getSubdomainType(): SubdomainType {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return config.devSubdomainType || 'global';
  }

  const subdomain = hostname.split('.')[0];
  
  switch (subdomain) {
    case config.globalSubdomain:
      return 'global';
    case config.authSubdomain:
      return 'auth';
    default:
      return 'tenant';
  }
}

export function getTenantFromSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return config.devTenantId;
  }

  const subdomain = hostname.split('.')[0];
  
  if (subdomain === config.globalSubdomain || subdomain === config.authSubdomain) {
    return null;
  }
  
  return subdomain;
}

export function getBaseDomain(): string {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname;
  }

  return config.baseDomain;
}

export function buildTenantUrl(tenant: string): string {
  const baseDomain = getBaseDomain();
  const protocol = window.location.protocol;
  return `${protocol}//${tenant}.${baseDomain}`;
}

export function buildGlobalUrl(): string {
  const baseDomain = getBaseDomain();
  const protocol = window.location.protocol;
  return `${protocol}//${config.globalSubdomain}.${baseDomain}`;
}

export function buildAuthUrl(): string {
  const baseDomain = getBaseDomain();
  const protocol = window.location.protocol;
  return `${protocol}//${config.authSubdomain}.${baseDomain}`;
} 