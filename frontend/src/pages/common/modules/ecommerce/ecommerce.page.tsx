import * as React from 'react'
import { UILD } from '@/lib/uild'
import { Frame } from '@/components/templates/Frame'

export default function ECommercePage() {
  const pageUild = UILD.generate('page', { type: 'ecommerce' })

  return (
    <Frame>
      <div data-uild={pageUild} className="p-6">
        <h1 className="text-2xl font-bold mb-6">eCommerce Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Orders</h2>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Inventory</h2>
            <p className="text-gray-600">Track and update stock levels</p>
          </div>
        </div>
      </div>
    </Frame>
  )
} 