import * as React from "react"
import { 
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom"
import { UILD } from "@/lib/uild"

// Router configuration with v7 features enabled
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_normalizeFormMethod: true
  }
}

// Disable browser back/forward cache and handle page transitions
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === 'back_forward') {
      window.location.reload()
    }
  })
}

// Loading fallback component
const LoadingFallback = React.memo(function LoadingFallback() {
  const loadingUild = UILD.generate("loading")
  return (
    <div data-uild={loadingUild} className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
})

// Error boundary component
const RouteError = React.memo(function RouteError() {
  const errorUild = UILD.generate("error")
  return (
    <div data-uild={errorUild} className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We're having trouble loading this page. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
})

// Lazy load components
const DashboardPage = React.lazy(() => import("@/pages/common/dashboard/dashboard.page"))
const Login = React.lazy(() => import("@/pages/auth/login.page"))
const EcommercePage = React.lazy(() => import("@/pages/common/modules/ecommerce/ecommerce.page"))
const CRMPage = React.lazy(() => import("@/pages/common/modules/crm/crm.page"))
const ERPPage = React.lazy(() => import("@/pages/common/modules/erp/erp.page"))
const AccountingPage = React.lazy(() => import("@/pages/common/modules/accounting/accounting.page"))
const TenantsListPage = React.lazy(() => import("@/pages/global/tenants/global.tenants.list.page"))

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <RouteError />
  },
  // Auth routes
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <Login />
      </React.Suspense>
    ),
    errorElement: <RouteError />
  },
  // Common routes
  {
    path: "/dashboard",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <DashboardPage />
      </React.Suspense>
    ),
    errorElement: <RouteError />
  },
  {
    path: "/modules",
    children: [
      {
        path: "ecommerce",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <EcommercePage />
          </React.Suspense>
        )
      },
      {
        path: "crm",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <CRMPage />
          </React.Suspense>
        )
      },
      {
        path: "erp",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <ERPPage />
          </React.Suspense>
        )
      },
      {
        path: "accounting",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <AccountingPage />
          </React.Suspense>
        )
      }
    ]
  },
  // Global admin features
  {
    path: "/admin",
    children: [
      {
        path: "tenants",
        element: (
          <React.Suspense fallback={<LoadingFallback />}>
            <TenantsListPage />
          </React.Suspense>
        )
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
    errorElement: <RouteError />
  }
], routerOptions)

export function AppRoutes() {
  const routesUild = UILD.generate("routes")
  return (
    <div data-uild={routesUild}>
      <RouterProvider router={router} fallback={<LoadingFallback />} />
    </div>
  )
} 