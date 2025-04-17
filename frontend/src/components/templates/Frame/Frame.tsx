import * as React from "react"
import { cn } from "@/lib/utils"
import { UILD } from "@/lib/uild"
import { useMockAuth } from "@/contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  uild?: string
  requiredRoles?: string[]
  requiredPermissions?: string[]
}

export function Frame({
  children,
  className,
  uild,
  requiredRoles = [],
  requiredPermissions = [],
  ...props
}: FrameProps) {
  const location = useLocation()
  const { user, logout, isSamuraiTenant, hasRole, hasPermission, isAuthenticated } = useMockAuth()
  const frameUild = UILD.generate("layout", { type: "frame" })
  const headerUild = UILD.generate("component", { type: "header" })
  const mainUild = UILD.generate("section", { type: "main" })
  const loadingUild = UILD.generate("loading", { type: "frame" })

  // Layer 1: Authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Layer 2: Role-based access control
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => {
      const hasRole = hasRole(role);
      console.log(`Checking role ${role}: ${hasRole ? 'has access' : 'no access'}`);
      return hasRole;
    });

  if (!hasRequiredRole) {
    console.log('Access denied - User lacks any of the required roles:', {
      requiredRoles,
      userRoles: user?.roles || []
    });
    return <Navigate to="/dashboard" replace />
  }

  // Layer 3: Permission-based access control
  const hasRequiredPermissions = requiredPermissions.length === 0 ||
    requiredPermissions.every(perm => {
      const hasPermission = hasPermission(perm);
      console.log(`Checking permission ${perm}: ${hasPermission ? 'has access' : 'no access'}`);
      return hasPermission;
    });

  if (!hasRequiredPermissions) {
    console.log('Access denied - User lacks required permissions:', {
      requiredPermissions,
      userRoles: user?.roles || []
    });
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div
      className={cn("min-h-screen bg-background", className)}
      data-uild={uild || frameUild}
      {...props}
    >
      {/* Header Integration */}
      <header className="border-b bg-white" data-uild={headerUild}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">Launch</span>
              {isSamuraiTenant && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Samurai Tenant</span>
              )}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              {isSamuraiTenant ? (
                <>
                  <a href="/admin/tenants" className="text-gray-600 hover:text-gray-900">
                    Tenants
                  </a>
                  <a href="/settings" className="text-gray-600 hover:text-gray-900">
                    Settings
                  </a>
                </>
              ) : (
                <>
                  <a href="/modules/crm" className="text-gray-600 hover:text-gray-900">
                    CRM
                  </a>
                  <a href="/modules/erp" className="text-gray-600 hover:text-gray-900">
                    ERP
                  </a>
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => logout()}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="container mx-auto px-4 py-6 space-y-6"
        data-uild={mainUild}
      >
        {children}
      </main>
    </div>
  )
} 