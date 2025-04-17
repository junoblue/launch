import * as React from 'react'
import { UILD } from '@/lib/uild'
import { Frame } from '@/components/ui/frame'
import { useAuth } from '@/lib/auth/auth-context'

const DashboardPage: React.FC = () => {
  const pageUild = UILD.generate('page', { type: 'common_dashboard' })
  const { user } = useAuth()

  return (
    <Frame uild={pageUild}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="mt-2 text-muted-foreground">Welcome, {user?.name || 'User'}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="mt-2 text-muted-foreground">No recent activity</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="mt-2 text-muted-foreground">Common actions will appear here</p>
        </div>
      </div>
    </Frame>
  )
}

DashboardPage.displayName = 'DashboardPage'

const WrappedDashboardPage = React.memo(DashboardPage)
export { WrappedDashboardPage as DashboardPage }
export default WrappedDashboardPage 