import * as React from "react"
import { UILD } from "@/lib/uild"

export default function GlobalTenantsListPage() {
  const pageUild = UILD.generate("page", { type: "global_tenants_list" })
  
  return (
    <div data-uild={pageUild} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Tenant
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Active Tenants</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Demo Tenant</h3>
                  <p className="text-gray-600">Created: April 16, 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Active</span>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    ⚙️
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Users: 1 | Storage: 2.3GB | Last active: 2h ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 