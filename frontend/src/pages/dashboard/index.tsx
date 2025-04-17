import * as React from "react"
import { UILD } from "@/lib/uild"

export default function DashboardPage() {
  const pageUild = UILD.generate("page", { type: "dashboard" })

  return (
    <div data-uild={pageUild} className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* TODO: Add dashboard widgets */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  )
} 