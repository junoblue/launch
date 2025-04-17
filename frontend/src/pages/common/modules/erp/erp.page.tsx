import * as React from 'react'
import { UILD } from '@/lib/uild'
import { Frame } from '@/components/templates/Frame'

export default function ERPPage() {
  const pageUild = UILD.generate('page', { type: 'erp' })

  return (
    <Frame>
      <div data-uild={pageUild} className="p-6">
        <h1 className="text-2xl font-bold mb-6">ERP Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <p className="text-gray-600">Manage company resources</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Planning</h2>
            <p className="text-gray-600">Enterprise resource planning</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Operations</h2>
            <p className="text-gray-600">Monitor business operations</p>
          </div>
        </div>
      </div>
    </Frame>
  )
} 