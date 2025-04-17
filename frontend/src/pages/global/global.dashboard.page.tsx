import * as React from "react"
import { UILD } from "@/lib/uild"
import { Frame } from "@/components/templates/Frame"

const GlobalDashboardPage: React.FC = () => {
  const pageUild = UILD.generate("page", { type: "global-dashboard" })

  return (
    <Frame uild={pageUild} isGlobalAdmin>
      <h1 className="text-2xl font-bold mb-6">Global Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>API Health</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cache</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tenant Metrics</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Active Tenants</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Users</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span>New Today</span>
              <span className="font-semibold">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>CPU Load</span>
              <span className="font-semibold">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Memory Usage</span>
              <span className="font-semibold">3.2 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage</span>
              <span className="font-semibold">156 GB</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export default GlobalDashboardPage 